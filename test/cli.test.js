import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { TwinSpec } from 'twinspec'
import { TwinCli } from 'twinspec/cli.js'

export class CliTest {
  static #cliSpec = TwinSpec.loadSpec()
  static #cliTexts = TwinCli.loadCli(CliTest.#cliSpec)
  static #presetSpec = TwinSpec.loadSpec(import.meta.resolve('twinspec/cli.md'))
  static #schemaFile = fileURLToPath(import.meta.resolve('twinspec/cli.schema.json'))
  static #engineDocsFolder = fileURLToPath(new URL('../docs/', import.meta.url))
  static #packageInfo = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  static #samplePackage = { name: 'sample', description: 'Sample tool', version: '1.0.0', bugs: { url: 'https://example.com/issues' } }
  static #clientTextIds = ['help', 'version', 'unknownCommand', 'optionMissing', 'commandError']
  static #tempFolder = realpathSync(mkdtempSync(join(tmpdir(), 'twinspec-cli-')))

  static {
    test(CliTest.#cliSpec.formatText('testHelp'), CliTest.#testHelp)
    test(CliTest.#cliSpec.formatText('testDocsOnce'), CliTest.#testDocsOnce)
    test(CliTest.#cliSpec.formatText('testClientDocs'), CliTest.#testClientDocs)
    test(CliTest.#cliSpec.formatText('testVersion'), CliTest.#testVersion)
    test(CliTest.#cliSpec.formatText('testOptions'), CliTest.#testOptions)
    test(CliTest.#cliSpec.formatText('testUnknownCommand'), CliTest.#testUnknownCommand)
    test(CliTest.#cliSpec.formatText('testOptionMissing'), CliTest.#testOptionMissing)
    test(CliTest.#cliSpec.formatText('testCommandError'), CliTest.#testCommandError)
    test(CliTest.#cliSpec.formatText('testBrokenCommand'), CliTest.#testBrokenCommand)
    test(CliTest.#cliSpec.formatText('testCliSchemaMissing'), CliTest.#testCliSchemaMissing)
    test(CliTest.#cliSpec.formatText('testPackageMissing'), CliTest.#testPackageMissing)
    test(CliTest.#cliSpec.formatText('testPackageFieldMissing'), CliTest.#testPackageFieldMissing)
    test(CliTest.#cliSpec.formatText('testBugsString'), CliTest.#testBugsString)
    test(CliTest.#cliSpec.formatText('testValueTaken'), CliTest.#testValueTaken)
    test(CliTest.#cliSpec.formatText('testTextIds'), CliTest.#testTextIds)
    after(CliTest.#removeTempFolder)
  }

  static #testHelp () {
    const helpText = CliTest.#cliTexts.formatText('help')
    const [helpStart] = helpText.split('\n\nDocs:\n')
    const expectedValues = { packageName: CliTest.#packageInfo.name, packageDescription: CliTest.#packageInfo.description }
    assert.equal(helpStart, CliTest.#cliSpec.formatText('expectedHelp', expectedValues))
    assert.ok(helpText.endsWith(CliTest.#packageInfo.bugs.url))
  }

  static #testDocsOnce () {
    const docLines = CliTest.#listDocLines(CliTest.#cliTexts.formatText('help'))
    const engineDocs = readdirSync(CliTest.#engineDocsFolder).filter(fileName => fileName.endsWith('.md'))
    assert.equal(docLines.length, engineDocs.length)
    assert.equal(new Set(docLines).size, docLines.length)
  }

  static #testClientDocs () {
    const cliFile = CliTest.#writeClient('client-docs', CliTest.#samplePackage, {
      'aaa.md': '---\ntitle: Aaa\ndescription: Read this before you test aaa\n---\n',
      'zzz.md': '---\ntitle: Zzz\ndescription: Read this before you test zzz\n---\n'
    })
    const docLines = CliTest.#listDocLines(TwinCli.loadCli(TwinSpec.loadSpec(cliFile)).formatText('help'))
    assert.ok(docLines.at(0).endsWith('aaa.md'))
    assert.ok(docLines.at(-1).endsWith('zzz.md'))
    assert.equal(docLines.length, readdirSync(CliTest.#engineDocsFolder).filter(fileName => fileName.endsWith('.md')).length + 2)
  }

  static #testVersion () {
    assert.equal(CliTest.#cliTexts.formatText('version'), `${CliTest.#packageInfo.name} ${CliTest.#packageInfo.version}`)
  }

  static #testOptions () {
    const { inputSchema } = CliTest.#cliSpec.frontMatter.commands.audit
    const { values: commandOptions } = parseArgs({ args: ['--library', './lib', '--fix'], options: inputSchema.properties })
    const missingNames = inputSchema.required.filter(optionName => !Object.hasOwn(commandOptions, optionName))
    assert.deepEqual({ ...commandOptions }, { library: './lib', fix: true })
    assert.deepEqual(missingNames, [])
  }

  static #testUnknownCommand () {
    assert.equal(CliTest.#cliTexts.formatText('unknownCommand', { commandName: 'oops' }), 'The command oops is unknown')
  }

  static #testOptionMissing () {
    assert.equal(CliTest.#cliTexts.formatText('optionMissing', { commandName: 'audit', optionName: 'library' }), 'The command audit needs --library')
  }

  static #testCommandError () {
    assert.equal(CliTest.#cliTexts.formatText('commandError', { errorText: 'The command oops is unknown' }), `${CliTest.#packageInfo.name}: The command oops is unknown`)
  }

  static #testBrokenCommand () {
    const filePath = join(CliTest.#tempFolder, 'broken-command.md')
    writeFileSync(filePath, `---\n$schema: ${CliTest.#schemaFile}\ntitle: Broken command\ndescription: A command line with a broken command\ncommands:\n  audit: {}\n---\n`)
    assert.throws(() => TwinSpec.loadSpec(filePath), thrownError => thrownError.message.includes('/commands/audit') && thrownError.message.includes("must have required property 'description'"))
  }

  static #testCliSchemaMissing () {
    const filePath = join(CliTest.#tempFolder, 'no-schema.md')
    writeFileSync(filePath, '---\ntitle: No schema\ndescription: A command line with no schema\n---\n')
    assert.throws(() => TwinCli.loadCli(TwinSpec.loadSpec(filePath)), CliTest.#matchError('cliSchemaMissing', { filePath }))
  }

  static #testPackageMissing () {
    const filePath = join(CliTest.#tempFolder, 'no-package', 'cli.md')
    mkdirSync(join(CliTest.#tempFolder, 'no-package'))
    writeFileSync(filePath, `---\n$schema: ${CliTest.#schemaFile}\ntitle: No package\ndescription: A command line with no package\ncommands:\n  build:\n    description: Build the package\n---\n`)
    assert.throws(() => TwinCli.loadCli(TwinSpec.loadSpec(filePath)), CliTest.#matchError('packageMissing', { filePath }))
  }

  static #testPackageFieldMissing () {
    const cliFile = CliTest.#writeClient('no-version', { ...CliTest.#samplePackage, version: '' }, {})
    const packageFile = join(CliTest.#tempFolder, 'no-version', 'package.json')
    assert.throws(() => TwinCli.loadCli(TwinSpec.loadSpec(cliFile)), CliTest.#matchError('packageFieldMissing', { packageFile, fieldName: 'version' }))
  }

  static #testBugsString () {
    const cliFile = CliTest.#writeClient('bugs-string', { ...CliTest.#samplePackage, bugs: 'https://example.com/bugs' }, {})
    assert.ok(TwinCli.loadCli(TwinSpec.loadSpec(cliFile)).formatText('help').endsWith('https://example.com/bugs'))
  }

  static #testValueTaken () {
    assert.throws(() => CliTest.#cliTexts.formatText('version', { packageName: 'other' }), CliTest.#matchError('valueTaken', { valueName: 'packageName', textId: 'version' }))
  }

  static #testTextIds () {
    const codeText = readFileSync(new URL('../presets/cli.js', import.meta.url), 'utf8')
    const usedIds = [...codeText.matchAll(/formatText\('(\w+)'/g)].map(idMatch => idMatch[1])
    assert.deepEqual([...new Set([...usedIds, ...CliTest.#clientTextIds])].sort(), Object.keys(CliTest.#presetSpec.frontMatter.texts).sort())
  }

  static #removeTempFolder () {
    rmSync(CliTest.#tempFolder, { recursive: true })
  }

  static #listDocLines (helpText) {
    const [docsText] = helpText.split('\n\nDocs:\n')[1].split('\n\n')
    return docsText.split('\n').filter(docLine => /^ {2}\S/.test(docLine)).map(docLine => docLine.trim())
  }

  static #writeClient (folderName, packageInfo, docTexts) {
    const clientFolder = join(CliTest.#tempFolder, folderName)
    mkdirSync(join(clientFolder, 'bin'), { recursive: true })
    writeFileSync(join(clientFolder, 'package.json'), JSON.stringify(packageInfo))
    writeFileSync(join(clientFolder, 'bin', 'cli.md'), `---\n$schema: ${CliTest.#schemaFile}\ntitle: Client\ndescription: The command line of a client\ncommands:\n  build:\n    description: Build the package\n---\n`)
    if (Object.keys(docTexts).length) mkdirSync(join(clientFolder, 'docs'))
    Object.entries(docTexts).forEach(([fileName, fileText]) => writeFileSync(join(clientFolder, 'docs', fileName), fileText))
    return join(clientFolder, 'bin', 'cli.md')
  }

  static #matchError (textId, textValues) {
    const errorStart = CliTest.#presetSpec.formatText(textId, textValues)
    return thrownError => thrownError.message.startsWith(errorStart)
  }
}
