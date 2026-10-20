---
title: Presets
description: "Read this before you use or publish a preset"
---
## Preset files

```
presets/
  {id}.md             the texts of the preset
  {id}.schema.json    the JSON Schema for the front matter of a client
  {id}.js             the class of the preset when the preset has code
```

- A preset is a set of texts that many packages share
- The file `{id}.md` is also the twin spec of `{id}.js`

## Use a preset

- Set the `$schema` of your front matter to `{package}/{id}.schema.json`
- Where a preset has no code load its texts with `TwinSpec.loadSpec(import.meta.resolve('{package}/{id}.md'))`
- Where a preset has code use the class in `{package}/{id}.js`
- Read [`presets/cli.md`](../presets/cli.md) for the preset `twinspec/cli`
- Read [`test/cli.test.js`](../test/cli.test.js) for a full client

## Publish a preset

- Put the files of a preset in `presets/`
- Add `"./*": "./presets/*"` to `exports` in `package.json`
- Node finds `{package}/{id}.md` with this subpath pattern

## See also

- [Node.js packages](https://nodejs.org/api/packages.html) explains the subpath patterns of `exports`
