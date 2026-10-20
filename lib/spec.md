---
title: Twinspec
description: "The `TwinSpec` class reads the twin spec of a code file"
texts:
  fileMissing: "The file {{filePath}} is missing"
  callerMissing: "TwinSpec found no caller file in the stack"
  frontMatterMissing: "The file {{filePath}} has no front matter"
  schemaBroken: "The front matter of {{filePath}} breaks {{schemaFile}} at {{keyPath}}: {{problemText}}"
  schemaMissing: "The $schema {{schemaName}} of {{filePath}} is missing"
  textMissing: "There is no text {{textId}} in {{filePath}}"
  textError: "The text {{textId}} of {{filePath}} has an error: {{errorText}}"
  yamlInvalid: "The front matter of {{filePath}} is not valid YAML: {{errorText}}"
  schemaInvalid: "The file {{schemaFile}} is not a valid JSON Schema: {{errorText}}"
  textInvalid: "The text {{textId}} of {{filePath}} is not valid Handlebars: {{errorText}}"
---
## `TwinSpec.loadSpec()`

### Syntax

```js
TwinSpec.loadSpec()
TwinSpec.loadSpec(specPath)
```

### Parameters

- `specPath` (optional)
  - The path of the twin spec or of its code file
  - A `file://` URL also works
  - Without `specPath` the function reads the twin spec of the caller file

### Return value

An object with 4 keys

| Key | Value |
|---|---|
| `frontMatter` | The front matter as an object |
| `bodyText` | The text after the front matter without empty space at the start or end |
| `filePath` | The full path of the `.md` file |
| `formatText` | The function that fills 1 text of `frontMatter.texts` |

### Exceptions

The function throws an `Error` with 1 of these texts

| Text | Case |
|---|---|
| `callerMissing` | The stack has no caller file |
| `fileMissing` | The `.md` file is missing |
| `frontMatterMissing` | The file has no front matter |
| `yamlInvalid` | The front matter has a YAML error or a YAML warning |
| `schemaBroken` | The front matter breaks `lib/spec.schema.json` or the `$schema` file |
| `schemaMissing` | Node finds no `$schema` file |
| `schemaInvalid` | The `$schema` file is not a valid JSON Schema in the strict mode of `ajv` |
| `textInvalid` | A text is not valid Handlebars |

### Description

1. Find the caller file when there is no `specPath`
2. Change the extension `.js` or `.mjs` or `.cjs` to `.md`
3. Read the file
4. Remove the BOM
5. Change each CRLF line end to LF
6. Parse the front matter as YAML
7. Test the front matter with `lib/spec.schema.json`
8. Test the front matter with the `$schema` file when the front matter has `$schema`
9. Test the Handlebars syntax of each text

- The caller file is the first file in the stack that is not `lib/spec.js`
- The function finds the `$schema` file like Node finds a module
- The search for the `$schema` file starts in the folder of the `.md` file
- The function tests the front matter with `ajv`
- The function uses JSON Schema draft 2020-12
- The function compiles each JSON Schema in the strict mode of `ajv`
- The error has 1 line of `schemaBroken` for each bad key
- The function prints nothing

### Examples

```md
---
# tools/audit.md
title: Audit tool
description: "The AuditTool class audits the files of a library folder"
texts:
  emptyFolder: "The folder {{folderPath}} is empty"
---
## Steps
```

```js
// in the class AuditTool of tools/audit.js
static #toolSpec = TwinSpec.loadSpec()

AuditTool.#toolSpec.frontMatter.title         // 'Audit tool'
AuditTool.#toolSpec.frontMatter.description   // 'The AuditTool class audits the files of a library folder'
AuditTool.#toolSpec.bodyText                  // '## Steps'
AuditTool.#toolSpec.filePath                  // '/abs/path/tools/audit.md'
```

## `formatText()`

### Syntax

```js
AuditTool.#toolSpec.formatText(textId)
AuditTool.#toolSpec.formatText(textId, textValues)
```

### Parameters

- `textId`
  - The id of a text in `frontMatter.texts`
- `textValues` (optional)
  - The values for the text

### Return value

The text with the values as a string

### Exceptions

The function throws an `Error` with 1 of these texts

| Text | Case |
|---|---|
| `textMissing` | `frontMatter.texts` has no `textId` |
| `textError` | Handlebars fails for example when a value is missing |

### Description

1. Find the text of `textId`
2. Fill the text with `textValues`
3. Return the text

- The text takes values only from `textValues`
- The function runs Handlebars with the option `strict`
- The function runs Handlebars with the option `noEscape`
- The option `noEscape` keeps the HTML in the values as it is
- If `{{name}}` has no value then the function throws `textError`
- If `{{#name}}` or `{{^name}}` has no value then the function throws `textError`
- If `{{#each name.key}}` has no `name` then the function throws `textError`
- If `{{#each name}}` or `{{#if name}}` has no value then the block renders nothing

### Examples

```js
AuditTool.#toolSpec.formatText('emptyFolder', { folderPath: './lib' })   // 'The folder ./lib is empty'
AuditTool.#toolSpec.formatText('emptyFolder', { folderPath: '<b>' })     // 'The folder <b> is empty'
AuditTool.#toolSpec.formatText('emptyFolder')                            // throws textError
```
