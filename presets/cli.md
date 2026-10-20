---
title: Command line preset
texts:
  cliSchemaMissing: "The file {{filePath}} needs $schema: twinspec/cli.schema.json"
  packageMissing: "TwinCli found no package.json above {{filePath}}"
  packageFieldMissing: "The file {{packageFile}} has no {{fieldName}}"
  docSentenceMissing: "The doc {{filePath}} has no first sentence"
  valueTaken: "The value {{valueName}} of {{textId}} comes from loadCli"
  help: |-
    {{packageDescription}}

    Usage: npx {{packageName}} <command>

    Examples:
    {{#each commands}}
    {{#each examples}}
      npx {{@root.packageName}} {{@../key}} {{args}}
        {{description}}
    {{/each}}
    {{/each}}

    Commands:
    {{#each commands}}
      {{@key}}{{#if inputSchema}} [options]{{else}} [args...]{{/if}}
        {{description}}
    {{#with inputSchema}}
    {{#each properties}}
        --{{@key}}{{#if title}} <{{title}}>{{/if}}
          {{description}}
    {{/each}}
    {{#each required}}
        The option --{{this}} is required
    {{/each}}
    {{/with}}
    {{/each}}

    Flags:
      -h --help
        Show this help
      --version
        Show the version

    Docs:
    {{#each docsList}}
      {{filePath}}
        {{firstSentence}}
    {{/each}}

    Report a problem at {{bugsUrl}}
  version: "{{packageName}} {{packageVersion}}"
  unknownCommand: "The command {{commandName}} is unknown"
  optionMissing: "The command {{commandName}} needs --{{optionName}}"
  commandError: "{{packageName}}: {{errorText}}"
---
The `TwinCli` class fills the texts of the command line of a package

## `TwinCli.loadCli()`

### Syntax

```js
TwinCli.loadCli(cliSpec)
```

### Parameters

- `cliSpec`
  - The result of `TwinSpec.loadSpec()` for the spec of the command line

### Return value

An object with 1 key

| Key | Value |
|---|---|
| `formatText` | The function that fills 1 text of this preset |

### Exceptions

The function throws an `Error` with 1 of these texts

| Text | Case |
|---|---|
| `cliSchemaMissing` | The `$schema` of `cliSpec` is not `twinspec/cli.schema.json` |
| `packageMissing` | No folder above `cliSpec.filePath` has a `package.json` |
| `packageFieldMissing` | The `package.json` has no `name` or `description` or `version` or URL of `bugs` |
| `docSentenceMissing` | A doc has no first sentence |

The function also throws the errors of [`TwinSpec.loadSpec`](../lib/spec.md#twinspecloadspec) for each doc

### Description

1. Test that the `$schema` of `cliSpec` finds `twinspec/cli.schema.json`
2. Find the nearest `package.json` above `cliSpec.filePath`
3. Read `name` from the `package.json`
4. Read `description` from the `package.json`
5. Read `version` from the `package.json`
6. Read the URL of `bugs` from the `package.json`
7. List the docs in `docs/` of twinspec
8. List the docs in `docs/` next to the `package.json` when the folder exists
9. Read each doc with `TwinSpec.loadSpec`
10. Sort the docs from a to z by the name of the file
11. Return `formatText`

- The help always lists the docs of twinspec
- The help lists the docs of the client only when the client has `docs/`
- When the client is twinspec the help lists each doc 1 time
- The path of each doc is relative to the current folder
- The first sentence of a doc is the first line of its `bodyText`
- When 2 docs have the same name the shorter path comes first
- The URL of `bugs` can be a string or the key `url` of an object
- The function reads each file only 1 time
- The function prints nothing

### Examples

```js
// bin/cli.js
const cliSpec = TwinSpec.loadSpec()
const cliTexts = TwinCli.loadCli(cliSpec)
```

## `formatText()`

### Syntax

```js
cliTexts.formatText(textId)
cliTexts.formatText(textId, textValues)
```

### Parameters

The same as [`formatText`](../lib/spec.md#formattext)

### Return value

The same as [`formatText`](../lib/spec.md#formattext)

### Exceptions

The function throws an `Error` with 1 of these texts

| Text | Case |
|---|---|
| `valueTaken` | A value of `textValues` has the name of a value from `loadCli` |

The function also throws the errors of [`formatText`](../lib/spec.md#formattext)

### Description

1. Add the values from `loadCli` to `textValues`
2. Call `formatText` of this preset

| Text | Values from `loadCli` | Values of the caller | When the client uses the text |
|---|---|---|---|
| `help` | `commands` `packageName` `packageDescription` `bugsUrl` `docsList` | None | The argument list is empty or has `-h` or `--help` |
| `version` | `packageName` `packageVersion` | None | The argument list has `--version` |
| `unknownCommand` | None | `commandName` | The command is not in `commands` |
| `optionMissing` | None | `commandName` `optionName` | An option in `required` is missing |
| `commandError` | `packageName` | `errorText` | A step fails |

- The help shows `[args...]` for a command without `inputSchema`
- The help shows `<title>` after an option with a `title`
- The file `test/cli.test.js` is a full sample of a client

### Examples

```js
cliTexts.formatText('version')                                 // 'my-tool 1.0.0'
cliTexts.formatText('unknownCommand', { commandName: 'oops' })  // 'The command oops is unknown'
```
