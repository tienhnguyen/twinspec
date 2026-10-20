import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TwinSpec } from '../lib/spec.js'

export class TwinCli {
  static #presetSpec = TwinSpec.loadSpec(import.meta.url)
  static #schemaFile = fileURLToPath(new URL('cli.schema.json', import.meta.url))
  static #engineDocsFolder = fileURLToPath(new URL('../docs/', import.meta.url))

  static loadCli (cliSpec) {
    TwinCli.#testSchema(cliSpec)
    const packageFile = TwinCli.#findPackageFile(cliSpec.filePath)
    const packageInfo = JSON.parse(readFileSync(packageFile, 'utf8'))
    const clientDocsFolder = join(dirname(packageFile), 'docs')
    const cliValues = {
      commands: cliSpec.frontMatter.commands,
      packageName: TwinCli.#readField(packageInfo.name, 'name', packageFile),
      packageDescription: TwinCli.#readField(packageInfo.description, 'description', packageFile),
      packageVersion: TwinCli.#readField(packageInfo.version, 'version', packageFile),
      bugsUrl: TwinCli.#readField(typeof packageInfo.bugs === 'string' ? packageInfo.bugs : packageInfo.bugs?.url, 'bugs.url', packageFile),
      docsList: TwinCli.#listDocs(existsSync(clientDocsFolder) ? [TwinCli.#engineDocsFolder, clientDocsFolder] : [TwinCli.#engineDocsFolder])
    }
    return {
      formatText: (textId, textValues = {}) => TwinCli.#formatCliText(cliValues, textId, textValues)
    }
  }

  static #testSchema (cliSpec) {
    const schemaFlag = Object.hasOwn(cliSpec.frontMatter, '$schema') && createRequire(cliSpec.filePath).resolve(cliSpec.frontMatter.$schema) === TwinCli.#schemaFile
    if (!schemaFlag) throw new Error(TwinCli.#presetSpec.formatText('cliSchemaMissing', { filePath: cliSpec.filePath }))
  }

  static #findPackageFile (filePath) {
    let folderPath = dirname(filePath)
    while (!existsSync(join(folderPath, 'package.json'))) {
      if (folderPath === dirname(folderPath)) throw new Error(TwinCli.#presetSpec.formatText('packageMissing', { filePath }))
      folderPath = dirname(folderPath)
    }
    return join(folderPath, 'package.json')
  }

  static #readField (fieldValue, fieldName, packageFile) {
    if (!fieldValue) throw new Error(TwinCli.#presetSpec.formatText('packageFieldMissing', { packageFile, fieldName }))
    return fieldValue
  }

  static #listDocs (docsFolders) {
    return [...new Set(docsFolders.map(docsFolder => realpathSync(docsFolder)))]
      .flatMap(docsFolder => readdirSync(docsFolder).filter(fileName => fileName.endsWith('.md')).map(fileName => join(docsFolder, fileName)))
      .map(docFile => TwinCli.#readDoc(docFile))
      .sort(TwinCli.#compareDocs)
  }

  static #formatCliText (cliValues, textId, textValues) {
    const takenName = Object.keys(textValues).find(valueName => Object.hasOwn(cliValues, valueName))
    if (takenName) throw new Error(TwinCli.#presetSpec.formatText('valueTaken', { valueName: takenName, textId }))
    return TwinCli.#presetSpec.formatText(textId, { ...cliValues, ...textValues })
  }

  static #readDoc (docFile) {
    return { filePath: relative(process.cwd(), docFile), description: TwinSpec.loadSpec(docFile).frontMatter.description }
  }

  static #compareDocs (firstDoc, secondDoc) {
    return basename(firstDoc.filePath).localeCompare(basename(secondDoc.filePath), 'en') || firstDoc.filePath.length - secondDoc.filePath.length
  }
}
