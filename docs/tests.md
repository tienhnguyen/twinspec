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
    test(ListTest.#twinSpec.formatText('testEmptyFolder'), ListTest.#testEmptyFolder)
  }

  static #testEmptyFolder () {}
}
```

- Put the tests in `test/`
- Name a test file `{id}.test.js`
- Name the class of a test file `{Id}Test`
- Give each test file a twin spec
- Register each test with a call to `test` in `static {}`
- Put each test in its own private method
- Write temp files in the folder of `os.tmpdir()`
- Remove the temp files in `after`

## Test names

```yaml
texts:
  testMissingFile: "loadSpec throws fileMissing when the file is missing"
```

- Put the name of each test under `texts` of the twin spec of the test
- Start a test name with the function or the text that the test tests
- A test name has no `and`
- So each test tests only 1 thing

## Errors

- Write 1 test for each row of the `Exceptions` table of a twin spec
- Compare an error with the text of the spec
- Never compare an error with a copy of the text
- Test that the code uses each text of its twin spec

## Run

- Put `node --test` in `scripts.test` of `package.json`
- The command `node --test test/` fails in Node 24
- So run `node --test` with no path
- Run `npm test` before each push

## See also

- [Node.js test runner](https://nodejs.org/api/test.html) explains `node --test`
- [`test/spec.test.js`](../test/spec.test.js) is a full sample of a test file
