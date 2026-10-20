---
title: Tests
---
Read this before you write a test

## Test files

```js
// test/list.test.js
import { test } from 'node:test'
import { TwinSpec } from 'twinspec'

export class ListTest {
  static #twinSpec = TwinSpec.loadSpec()

  static {
    test(ListTest.#twinSpec.formatText('testIdPattern'), ListTest.#testIdPattern)
  }

  static #testIdPattern () {}
}
```

- Put the tests in `test/`
- Name a test file `{id}.test.js`
- Register each test with a call to `test` in `static {}`
- Put each test in its own private method
- Write temp files in the folder of `os.tmpdir()`
- Remove the temp files in `after`
- Read [`test/spec.test.js`](../test/spec.test.js) for a full test file

## Test names

```yaml
texts:
  testIdPattern: "listIds keeps only the file names that are ids"
```

- A test name is a text of the twin spec of the test
- Start a test name with the function or text or file under test
- Test only 1 thing in each test

## Errors

- Write 1 test for each row of the `Exceptions` table of a twin spec
- Compare an error with the text of the twin spec
- Never compare an error with a copy of the text
- Test that each text id in the code is in its twin spec
- Test each text that the code does not use with its own test

## Run

- Put `node --test` in `scripts.test` of `package.json`
- The command `node --test test/` fails in Node 24
- So run `node --test` with no path
- Run `npm test` before each push

## See also

- [Node.js test runner](https://nodejs.org/api/test.html) explains `node --test`
