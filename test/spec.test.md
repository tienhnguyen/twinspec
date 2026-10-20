---
title: Spec test
texts:
  testCallerFile: "loadSpec reads the twin spec of the caller file"
  testMetaUrl: "loadSpec reads the twin spec from import.meta.url"
  testBomFile: "loadSpec removes the BOM at the start of a file"
  testCrlfFile: "loadSpec reads each CRLF line end as LF"
  testCallerMissing: "loadSpec throws callerMissing when the stack has no caller file"
  testFileMissing: "loadSpec throws fileMissing when the file is missing"
  testFrontMatterMissing: "loadSpec throws frontMatterMissing when the file has no front matter"
  testYamlInvalid: "loadSpec throws yamlInvalid for a YAML error"
  testYamlWarning: "loadSpec throws yamlInvalid for a YAML warning"
  testSchemaBroken: "loadSpec throws schemaBroken when the title is missing"
  testSpaceTitle: "loadSpec throws schemaBroken when the title is only spaces"
  testSchemaPlace: "loadSpec shows the place of the bad key in schemaBroken"
  testSchemaFile: "loadSpec tests the front matter with the $schema file"
  testSchemaMissing: "loadSpec throws schemaMissing when Node finds no $schema file"
  testSchemaInvalid: "loadSpec throws schemaInvalid for a bad JSON Schema"
  testLooseSchema: "loadSpec throws schemaInvalid for a JSON Schema that breaks the strict mode of ajv"
  testTextInvalid: "loadSpec throws textInvalid for bad Handlebars"
  testFilledText: "formatText fills the values"
  testHtmlValue: "formatText keeps the HTML in the values"
  testTextError: "formatText throws textError when a value is missing"
  testTextMissing: "formatText throws textMissing for an unknown id"
  testObjectLoop: "formatText loops over an object with each"
  testMissingList: "formatText renders nothing for each when the list is missing"
  testNestedList: "formatText throws textError for each when the parent is missing"
  testInverseBlock: "formatText throws textError for an inverse block without its value"
  testTextIds: "lib/spec.js uses each text of lib/spec.md"
  emptyFolder: "The folder {{folderPath}} is empty"
  commandList: |-
    {{#each commands}}
    {{@key}} {{description}}
    {{/each}}
  nestedList: "{{#each folder.files}}{{this}}{{/each}}"
  fileCount: "{{^manyFlag}}1 file{{/manyFlag}}"
---
The `SpecTest` class tests `lib/spec.js`
