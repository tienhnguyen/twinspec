---
title: Presets
---
Read this before you use or publish a preset

## Use a preset

```js
// bin/cli.js
import { TwinSpec } from 'twinspec'
import { TwinCli } from 'twinspec/cli.js'

export class ToolCli {
  static #cliSpec = TwinSpec.loadSpec()
  static #cliTexts = TwinCli.loadCli(ToolCli.#cliSpec)
}
```

- A preset is a set of texts that many packages share
- A preset has a JSON Schema for the front matter of a client
- Set the `$schema` of your front matter to `{package}/{id}.schema.json`
- Load the texts of a preset with `TwinSpec.loadSpec(import.meta.resolve('{package}/{id}.md'))`
- A preset with code gives a class in `{package}/{id}.js`
- For example `twinspec/cli.js` gives the class `TwinCli`
- Read [`presets/cli.md`](../presets/cli.md) for the preset `twinspec/cli`
- Read [`test/cli.test.js`](../test/cli.test.js) for a full client

## Publish a preset

```
presets/
  {id}.md             the texts of the preset
  {id}.schema.json    the JSON Schema for the front matter of a client
  {id}.js             the code of the preset when the preset has code
```

```json
"exports": {
  ".": "./lib/spec.js",
  "./*": "./presets/*"
}
```

- Put the files of a preset in `presets/`
- Add `"./*": "./presets/*"` to `exports` in `package.json`
- Node finds `{package}/{id}.md` with this subpath pattern
- The file `{id}.md` is also the twin spec of `{id}.js`

## See also

- [`presets/cli.md`](../presets/cli.md) explains the preset `twinspec/cli`
- [Node.js packages](https://nodejs.org/api/packages.html) explains the subpath patterns of `exports`
