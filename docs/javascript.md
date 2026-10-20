---
title: JavaScript
description: "Read this before you write a JavaScript file"
---
## Folders

```
bin/        the code of the command line
lib/        the main code that other packages import
docs/       the docs of the package
{kind}/     the files of 1 kind for example presets/ or test/ or tools/
```

- Keep in the root only the files that a tool needs
- Put the code of the command line in `bin/`
- Put the main code that other packages import in `lib/`
- Give each other folder the name of the kind of its files

## Files

```
bin/cli.js           MyCli        the command line of a package with the prefix My
lib/spec.js          TwinSpec     a class that other packages import
presets/cli.js       TwinCli      a class that other packages import
test/spec.test.js    SpecTest     another class
tools/audit.js       AuditTool    another class
```

- Put the code of each file in 1 class
- Keep the names of files that a platform or a tool sets
- For example `functions/index.js` of a Firebase app keeps its name
- The file `functions/index.js` has no class
- Export the class with `export class`
- Name each file with the id of its thing
- Name a class that other packages import `{Prefix}{Id}`
- The `{Prefix}` is the short name of the package for example `Twin` of twinspec
- Name the class of `bin/cli.js` `{Prefix}Cli`
- Name each other class `{Id}{Kind}`

## Order

```js
import { readdir } from 'node:fs/promises'

export class ListTool {
  static #idPattern = /^[a-z][a-z0-9_]*$/

  static async listIds (folderPath) {
    const fileNames = await readdir(folderPath)
    return ListTool.#filterIds(fileNames)
  }

  static #filterIds (fileNames) {
    return fileNames.filter(fileName => ListTool.#idPattern.test(fileName))
  }
}
```

- Put the imports first
- Put the class after the imports
- After the class put only the exports that a platform needs
- Order the members of a class like this
  1. Fields
  2. `static {}`
  3. Public methods
  4. Private methods
- Write only calls in `static {}`
- Put the private methods in the order that the class first names them
- A helper is a method that 2 or more members use
- Put the helpers at the end in the same order
- Put the methods that only helpers use there too

## Names

- Name each variable with a noun
- Name each field with a noun
- Name each function with a verb
- Name each method with a verb
- Use 2 or more words in camelCase for each name
- End the name of a boolean with `Flag` for example `nestedFlag`
- Give a name to each value when the code does not show its meaning
- For example `refreshMargin` is the name of `300_000`
- Keep the names that a platform or a tool sets for example `connectedCallback`
- Let the names explain the code
- Write no comments

## Errors

```js
try {
  return JSON.parse(readFileSync(configFile, 'utf8'))
} catch (parseError) {
  throw new Error(ConfigTool.#toolSpec.formatText('configInvalid', { configFile }), { cause: parseError })
}
```

- Throw an error when something is wrong
- Catch an error only to report the error
- Pass the caught error as the `cause` of the new error
- Never catch an error to hide the error
- Never catch an error to guess a fix
- Test if an optional file exists before you read the file
- A script writes the error to stderr
- Then the script sets `process.exitCode` to 1
- `process.exit()` can stop the script before the script writes its output
- So never call `process.exit()`

## Format

- Follow the style rules of neostandard
- For example use single quotes
- For example use no semicolons
- For example put a space before the `(` of a function

## See also

- [neostandard](https://github.com/neostandard/neostandard) explains the style rules
- [Node.js process](https://nodejs.org/api/process.html) explains how a script ends
- [Error cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) explains the `cause` of an error
