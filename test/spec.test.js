import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { TwinSpec } from 'twinspec'

export class SpecTest {
  static #engineSpec = TwinSpec.loadSpec(fileURLToPath(new URL('../lib/spec.md', import.meta.url)))
  static #baseSchemaFile = fileURLToPath(new URL('../lib/spec.schema.json', import.meta.url))
  static #twinSpec = TwinSpec.loadSpec()
  static #tempFolder = realpathSync(mkdtempSync(join(tmpdir(), 'twinspec-')))
  static #bomMark = String.fromCodePoint(0xfeff)

  static {
    test(SpecTest.#twinSpec.formatText('testCallerFile'), SpecTest.#testCallerFile)
    test(SpecTest.#twinSpec.formatText('testMetaUrl'), SpecTest.#testMetaUrl)
    test(SpecTest.#twinSpec.formatText('testBomFile'), SpecTest.#testBomFile)
    test(SpecTest.#twinSpec.formatText('testCrlfFile'), SpecTest.#testCrlfFile)
    test(SpecTest.#twinSpec.formatText('testCallerMissing'), SpecTest.#testCallerMissing)
    test(SpecTest.#twinSpec.formatText('testFileMissing'), SpecTest.#testFileMissing)
    test(SpecTest.#twinSpec.formatText('testFrontMatterMissing'), SpecTest.#testFrontMatterMissing)
    test(SpecTest.#twinSpec.formatText('testYamlInvalid'), SpecTest.#testYamlInvalid)
    test(SpecTest.#twinSpec.formatText('testYamlWarning'), SpecTest.#testYamlWarning)
    test(SpecTest.#twinSpec.formatText('testSchemaBroken'), SpecTest.#testSchemaBroken)
    test(SpecTest.#twinSpec.formatText('testDescriptionMissing'), SpecTest.#testDescriptionMissing)
    test(SpecTest.#twinSpec.formatText('testSpaceTitle'), SpecTest.#testSpaceTitle)
    test(SpecTest.#twinSpec.formatText('testSchemaPlace'), SpecTest.#testSchemaPlace)
    test(SpecTest.#twinSpec.formatText('testSchemaFile'), SpecTest.#testSchemaFile)
    test(SpecTest.#twinSpec.formatText('testSchemaMissing'), SpecTest.#testSchemaMissing)
    test(SpecTest.#twinSpec.formatText('testSchemaInvalid'), SpecTest.#testSchemaInvalid)
    test(SpecTest.#twinSpec.formatText('testLooseSchema'), SpecTest.#testLooseSchema)
    test(SpecTest.#twinSpec.formatText('testTextInvalid'), SpecTest.#testTextInvalid)
    test(SpecTest.#twinSpec.formatText('testFilledText'), SpecTest.#testFilledText)
    test(SpecTest.#twinSpec.formatText('testHtmlValue'), SpecTest.#testHtmlValue)
    test(SpecTest.#twinSpec.formatText('testTextError'), SpecTest.#testTextError)
    test(SpecTest.#twinSpec.formatText('testTextMissing'), SpecTest.#testTextMissing)
    test(SpecTest.#twinSpec.formatText('testObjectLoop'), SpecTest.#testObjectLoop)
    test(SpecTest.#twinSpec.formatText('testMissingList'), SpecTest.#testMissingList)
    test(SpecTest.#twinSpec.formatText('testNestedList'), SpecTest.#testNestedList)
    test(SpecTest.#twinSpec.formatText('testInverseBlock'), SpecTest.#testInverseBlock)
    test(SpecTest.#twinSpec.formatText('testTextIds'), SpecTest.#testTextIds)
    after(SpecTest.#removeTempFolder)
  }

  static #testCallerFile () {
    assert.equal(SpecTest.#twinSpec.frontMatter.title, 'Spec test')
    assert.equal(SpecTest.#twinSpec.filePath, fileURLToPath(new URL('spec.test.md', import.meta.url)))
  }

  static #testMetaUrl () {
    assert.equal(TwinSpec.loadSpec(import.meta.url).frontMatter.title, 'Spec test')
  }

  static #testBomFile () {
    const bomSpec = TwinSpec.loadSpec(SpecTest.#writeSpec('bom.md', `${SpecTest.#bomMark}---\ntitle: Bom\ndescription: A file with a BOM\n---\n`))
    assert.equal(bomSpec.frontMatter.title, 'Bom')
  }

  static #testCrlfFile () {
    const crlfSpec = TwinSpec.loadSpec(SpecTest.#writeSpec('crlf.md', '---\r\ntitle: Crlf\r\ndescription: A file with CRLF\r\n---\r\n\r\nBody text\r\n'))
    assert.equal(crlfSpec.frontMatter.title, 'Crlf')
    assert.equal(crlfSpec.bodyText, 'Body text')
  }

  static #testCallerMissing () {
    return assert.rejects(Promise.resolve().then(TwinSpec.loadSpec), SpecTest.#matchError('callerMissing'))
  }

  static #testFileMissing () {
    const filePath = join(SpecTest.#tempFolder, 'missing.md')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('fileMissing', { filePath }))
  }

  static #testFrontMatterMissing () {
    const filePath = SpecTest.#writeSpec('plain.md', '# Plain\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('frontMatterMissing', { filePath }))
  }

  static #testYamlInvalid () {
    const filePath = SpecTest.#writeSpec('yaml-error.md', '---\ntitle: [open\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('yamlInvalid', { filePath, errorText: '' }))
  }

  static #testYamlWarning () {
    const filePath = SpecTest.#writeSpec('yaml-warning.md', '---\ntitle: !unknown text\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('yamlInvalid', { filePath, errorText: '' }))
  }

  static #testSchemaBroken () {
    const filePath = SpecTest.#writeSpec('no-title.md', '---\ndescription: A file with no title\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaBroken', { filePath, schemaFile: SpecTest.#baseSchemaFile, keyPath: '/', problemText: "must have required property 'title'" }))
  }

  static #testDescriptionMissing () {
    const filePath = SpecTest.#writeSpec('no-description.md', '---\ntitle: No description\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaBroken', { filePath, schemaFile: SpecTest.#baseSchemaFile, keyPath: '/', problemText: "must have required property 'description'" }))
  }

  static #testSpaceTitle () {
    const filePath = SpecTest.#writeSpec('space-title.md', '---\ntitle: "  "\ndescription: A file with a blank title\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaBroken', { filePath, schemaFile: SpecTest.#baseSchemaFile, keyPath: '/title', problemText: '' }))
  }

  static #testSchemaPlace () {
    const filePath = SpecTest.#writeSpec('number-text.md', '---\ntitle: Number text\ndescription: A file with a number text\ntexts:\n  countText: 1\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaBroken', { filePath, schemaFile: SpecTest.#baseSchemaFile, keyPath: '/texts/countText', problemText: '' }))
  }

  static #testSchemaFile () {
    const schemaFile = SpecTest.#writeSpec('command.schema.json', JSON.stringify({ type: 'object', properties: { commands: { type: 'object' } }, required: ['commands'] }))
    const goodFile = SpecTest.#writeSpec('good-command.md', '---\n$schema: ./command.schema.json\ntitle: Good\ndescription: A file with commands\ncommands: {}\n---\n')
    const badFile = SpecTest.#writeSpec('bad-command.md', '---\n$schema: ./command.schema.json\ntitle: Bad\ndescription: A file with no commands\n---\n')
    assert.deepEqual(TwinSpec.loadSpec(goodFile).frontMatter.commands, {})
    assert.throws(() => TwinSpec.loadSpec(badFile), SpecTest.#matchError('schemaBroken', { filePath: badFile, schemaFile, keyPath: '/', problemText: '' }))
  }

  static #testSchemaMissing () {
    const filePath = SpecTest.#writeSpec('lost-schema.md', '---\n$schema: ./lost.schema.json\ntitle: Lost\ndescription: A file with a lost schema\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaMissing', { schemaName: './lost.schema.json', filePath }))
  }

  static #testSchemaInvalid () {
    const schemaFile = SpecTest.#writeSpec('broken.schema.json', '{ "type": 5 }')
    const filePath = SpecTest.#writeSpec('broken-schema.md', '---\n$schema: ./broken.schema.json\ntitle: Broken\ndescription: A file with a broken schema\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaInvalid', { schemaFile, errorText: '' }))
  }

  static #testLooseSchema () {
    const schemaFile = SpecTest.#writeSpec('loose.schema.json', JSON.stringify({ properties: { commands: { type: 'object' } } }))
    const filePath = SpecTest.#writeSpec('loose-schema.md', '---\n$schema: ./loose.schema.json\ntitle: Loose\ndescription: A file with a loose schema\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('schemaInvalid', { schemaFile, errorText: '' }))
  }

  static #testTextInvalid () {
    const filePath = SpecTest.#writeSpec('open-block.md', '---\ntitle: Open block\ndescription: A file with an open block\ntexts:\n  openBlock: "{{#each items}}"\n---\n')
    assert.throws(() => TwinSpec.loadSpec(filePath), SpecTest.#matchError('textInvalid', { textId: 'openBlock', filePath, errorText: '' }))
  }

  static #testFilledText () {
    assert.equal(SpecTest.#twinSpec.formatText('emptyFolder', { folderPath: './lib' }), 'The folder ./lib is empty')
  }

  static #testHtmlValue () {
    assert.equal(SpecTest.#twinSpec.formatText('emptyFolder', { folderPath: '<b>' }), 'The folder <b> is empty')
  }

  static #testTextError () {
    assert.throws(() => SpecTest.#twinSpec.formatText('emptyFolder'), SpecTest.#matchError('textError', { textId: 'emptyFolder', filePath: SpecTest.#twinSpec.filePath, errorText: '' }))
  }

  static #testTextMissing () {
    assert.throws(() => SpecTest.#twinSpec.formatText('unknownText'), SpecTest.#matchError('textMissing', { textId: 'unknownText', filePath: SpecTest.#twinSpec.filePath }))
  }

  static #testObjectLoop () {
    assert.equal(SpecTest.#twinSpec.formatText('commandList', { commands: { audit: { description: 'Audit a folder' } } }), 'audit Audit a folder\n')
  }

  static #testMissingList () {
    assert.equal(SpecTest.#twinSpec.formatText('commandList'), '')
  }

  static #testNestedList () {
    assert.equal(SpecTest.#twinSpec.formatText('nestedList', { folder: { files: ['a'] } }), 'a')
    assert.throws(() => SpecTest.#twinSpec.formatText('nestedList'), SpecTest.#matchError('textError', { textId: 'nestedList', filePath: SpecTest.#twinSpec.filePath, errorText: '' }))
  }

  static #testInverseBlock () {
    assert.equal(SpecTest.#twinSpec.formatText('fileCount', { manyFlag: false }), '1 file')
    assert.throws(() => SpecTest.#twinSpec.formatText('fileCount'), SpecTest.#matchError('textError', { textId: 'fileCount', filePath: SpecTest.#twinSpec.filePath, errorText: '' }))
  }

  static #testTextIds () {
    const codeText = readFileSync(new URL('../lib/spec.js', import.meta.url), 'utf8')
    const usedIds = [...codeText.matchAll(/formatText\('(\w+)'/g)].map(idMatch => idMatch[1]).sort()
    assert.deepEqual([...new Set(usedIds)], Object.keys(SpecTest.#engineSpec.frontMatter.texts).sort())
  }

  static #removeTempFolder () {
    rmSync(SpecTest.#tempFolder, { recursive: true })
  }

  static #writeSpec (fileName, fileText) {
    const filePath = join(SpecTest.#tempFolder, fileName)
    writeFileSync(filePath, fileText)
    return filePath
  }

  static #matchError (textId, textValues) {
    const errorStart = SpecTest.#engineSpec.formatText(textId, textValues)
    return thrownError => thrownError.message.startsWith(errorStart)
  }
}
