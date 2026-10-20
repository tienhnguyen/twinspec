import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import Handlebars from 'handlebars'
import { parseDocument } from 'yaml'

export class TwinSpec {
  static #engineFile = fileURLToPath(import.meta.url)
  static #baseSchemaFile = fileURLToPath(new URL('spec.schema.json', import.meta.url))
  static #callerPattern = /((?:file:\/\/|\/|[A-Za-z]:\\).+?\.[cm]?js):\d+:\d+\)?$/gm
  static #codePattern = /\.[cm]?js$/
  static #bomPattern = new RegExp(`^${String.fromCodePoint(0xfeff)}`)
  static #frontMatterPattern = /^---\n([\s\S]*?)(?<=\n)---(?:\n|$)/
  static #templateOptions = { strict: true, noEscape: true }
  static #templateEngine = Handlebars.create()
  static #schemaChecker = new Ajv2020({ allErrors: true, strict: true })
  static #schemaTests = new Map()
  static #ownSpec = TwinSpec.loadSpec(import.meta.url)

  static loadSpec (specPath = TwinSpec.#findCallerFile()) {
    const filePath = TwinSpec.#nameSpecFile(specPath)
    if (!existsSync(filePath)) throw new Error(TwinSpec.#ownSpec.formatText('fileMissing', { filePath }))
    const { frontMatter, bodyText } = TwinSpec.#parseSpec(readFileSync(filePath, 'utf8'), filePath)
    TwinSpec.#testSchema(TwinSpec.#baseSchemaFile, frontMatter, filePath)
    if (Object.hasOwn(frontMatter, '$schema')) TwinSpec.#testSchema(TwinSpec.#findSchemaFile(frontMatter.$schema, filePath), frontMatter, filePath)
    const textTemplates = TwinSpec.#compileTexts(frontMatter.texts ?? {}, filePath)
    return {
      frontMatter,
      bodyText,
      filePath,
      formatText: (textId, textValues = {}) => TwinSpec.#formatSpecText(textTemplates, textId, textValues, filePath)
    }
  }

  static #findCallerFile () {
    const stackFiles = [...new Error().stack.matchAll(TwinSpec.#callerPattern)].map(stackMatch => TwinSpec.#readPath(stackMatch[1]))
    const callerFile = stackFiles.find(stackFile => stackFile !== TwinSpec.#engineFile)
    if (!callerFile) throw new Error(TwinSpec.#ownSpec.formatText('callerMissing'))
    return callerFile
  }

  static #nameSpecFile (specPath) {
    return resolve(TwinSpec.#readPath(String(specPath))).replace(TwinSpec.#codePattern, '.md')
  }

  static #parseSpec (specText, filePath) {
    const plainText = specText.replace(TwinSpec.#bomPattern, '').replace(/\r\n/g, '\n')
    const frontMatterMatch = plainText.match(TwinSpec.#frontMatterPattern)
    if (!frontMatterMatch) throw new Error(TwinSpec.#ownSpec.formatText('frontMatterMissing', { filePath }))
    return { frontMatter: TwinSpec.#parseFrontMatter(frontMatterMatch[1], filePath), bodyText: plainText.slice(frontMatterMatch[0].length).trim() }
  }

  static #testSchema (schemaFile, frontMatter, filePath) {
    const schemaTest = TwinSpec.#compileSchema(schemaFile)
    if (schemaTest(frontMatter)) return
    const schemaProblems = schemaTest.errors.map(schemaError => TwinSpec.#ownSpec.formatText('schemaBroken', { filePath, schemaFile, keyPath: schemaError.instancePath || '/', problemText: schemaError.message }))
    throw new Error(schemaProblems.join('\n'))
  }

  static #findSchemaFile (schemaName, filePath) {
    try {
      return createRequire(filePath).resolve(schemaName)
    } catch (resolveError) {
      throw new Error(TwinSpec.#ownSpec.formatText('schemaMissing', { schemaName, filePath }), { cause: resolveError })
    }
  }

  static #compileTexts (textSources, filePath) {
    return Object.fromEntries(Object.entries(textSources).map(([textId, textSource]) => [textId, TwinSpec.#compileText(textId, textSource, filePath)]))
  }

  static #formatSpecText (textTemplates, textId, textValues, filePath) {
    if (!Object.hasOwn(textTemplates, textId)) throw new Error(TwinSpec.#ownSpec.formatText('textMissing', { textId, filePath }))
    try {
      return textTemplates[textId](textValues)
    } catch (renderError) {
      throw new Error(TwinSpec.#ownSpec.formatText('textError', { textId, filePath, errorText: renderError.message }), { cause: renderError })
    }
  }

  static #parseFrontMatter (yamlText, filePath) {
    const yamlDocument = parseDocument(yamlText)
    const [yamlProblem] = [...yamlDocument.errors, ...yamlDocument.warnings]
    if (yamlProblem) throw new Error(TwinSpec.#ownSpec.formatText('yamlInvalid', { filePath, errorText: yamlProblem.message }))
    return yamlDocument.toJS()
  }

  static #compileSchema (schemaFile) {
    if (TwinSpec.#schemaTests.has(schemaFile)) return TwinSpec.#schemaTests.get(schemaFile)
    try {
      TwinSpec.#schemaTests.set(schemaFile, TwinSpec.#schemaChecker.compile(JSON.parse(readFileSync(schemaFile, 'utf8'))))
    } catch (schemaError) {
      throw new Error(TwinSpec.#ownSpec.formatText('schemaInvalid', { schemaFile, errorText: schemaError.message }), { cause: schemaError })
    }
    return TwinSpec.#schemaTests.get(schemaFile)
  }

  static #compileText (textId, textSource, filePath) {
    try {
      TwinSpec.#templateEngine.parse(textSource)
    } catch (parseError) {
      throw new Error(TwinSpec.#ownSpec.formatText('textInvalid', { textId, filePath, errorText: parseError.message }), { cause: parseError })
    }
    return TwinSpec.#templateEngine.compile(textSource, TwinSpec.#templateOptions)
  }

  static #readPath (pathText) {
    return pathText.startsWith('file:') ? fileURLToPath(pathText) : pathText
  }
}
