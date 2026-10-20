---
title: Twinspec
description: "Read this before you write a twin spec"
---
## Twin files

```
tools/audit.js    the code
tools/audit.md    the twin spec of the code
```

```js
import { readdir } from 'node:fs/promises'
import { TwinSpec } from 'twinspec'

export class AuditTool {
  static #toolSpec = TwinSpec.loadSpec()

  static async listFiles (folderPath) {
    const fileNames = await readdir(folderPath)
    if (!fileNames.length) throw new Error(AuditTool.#toolSpec.formatText('emptyFolder', { folderPath }))
    return fileNames
  }
}
```

- Give each file that imports twinspec a twin spec
- The twin spec has the name of the file with the extension `.md`
- Read the twin spec of a file before you change the file
- Load the twin spec 1 time in a private static field
- Write the twin spec as a reference page of [`markdown.md`](markdown.md#reference-page)
- Name each error in the `Exceptions` table by its text id
- Read [`lib/spec.md`](../lib/spec.md) for the functions of twinspec
- Read [`markdown.md`](markdown.md#front-matter) for the front matter
- Twinspec reads files with `node:fs`
- So browser code keeps its texts in the code

## Texts

```yaml
texts:
  fileCount: "The folder has {{fileCount}} {{#singularFlag}}file{{/singularFlag}}{{^singularFlag}}files{{/singularFlag}}"
```

- Put each text that a person reads under `texts` of the twin spec
- Keep in code only the id of each text
- A value like `yes` is not a text
- Write each text with the rules of [`writing.md`](writing.md)
- Write a text of 1 line between double quotes
- Write a text of 2 or more lines as a YAML block with `|-`
- Never write `\n` in a YAML text
- List the texts in the order that the code first uses them
- A code search finds an id only when the id is a plain string
- So call `formatText` with the id as a plain string
- Pass the front matter as values when a text needs it for example `{ ...AuditTool.#toolSpec.frontMatter, folderPath }`
- Handlebars has no plural helper
- So give the text a boolean like `singularFlag`
- Use the block `{{#name}}` or `{{^name}}` for a boolean
- Use `{{#if name}}` only for a value that can be missing
- Read [`formatText`](../lib/spec.md#formattext) for each block without its value

## Data

```yaml
---
$schema: ./audit.schema.json
title: Audit tool
description: "The AuditTool class audits the files of a library folder"
folderLimit: 10
---
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["folderLimit"],
  "properties": {
    "folderLimit": { "description": "The most folders that 1 audit reads", "type": "integer" }
  }
}
```

- Put the data of the code in the front matter of the twin spec
- Give the data its own JSON Schema
- Put the rules of the data in the `description` of the JSON Schema
- Follow the strict mode of `ajv` that [`loadSpec`](../lib/spec.md#description) uses
  - Give each keyword its `type` for example `type: object` for `properties`
  - Give each value only 1 type
  - Set `minItems` of a tuple to the count of `prefixItems`
  - Set `maxItems` of a tuple to the count of `prefixItems`
  - List each key of `required` in `properties` at the same level

## See also

- [Handlebars](https://handlebarsjs.com/guide/) explains the syntax of the texts
- [Handlebars built-in helpers](https://handlebarsjs.com/guide/builtin-helpers.html) lists the 6 helpers of Handlebars
- [JSON Schema](https://json-schema.org/) explains the schema of a front matter
- [Ajv strict mode](https://ajv.js.org/strict-mode.html) explains the strict rules of a JSON Schema
