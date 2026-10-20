# Contributing

This file holds the rules of the twinspec project

## Setup

```sh
git clone https://github.com/tienhnguyen/twinspec.git
cd twinspec
npm i
npm test
```

- Clone the repo next to the projects that use twinspec
- Run `npm link ../twinspec` in a project to use your copy of twinspec

## Shared rules

- Follow each doc in `docs/`
  - [`docs/commits.md`](docs/commits.md)
  - [`docs/javascript.md`](docs/javascript.md)
  - [`docs/markdown.md`](docs/markdown.md)
  - [`docs/packages.md`](docs/packages.md)
  - [`docs/presets.md`](docs/presets.md)
  - [`docs/tests.md`](docs/tests.md)
  - [`docs/twinspec.md`](docs/twinspec.md)
  - [`docs/writing.md`](docs/writing.md)

## Own texts

- `lib/spec.js` loads its twin spec with `TwinSpec.loadSpec(import.meta.url)`
- The caller search of `loadSpec` skips `lib/spec.js`
- So this call needs the path
- This call is the last field of `TwinSpec`
- The fields above it must exist before the call
- `presets/cli.js` loads `presets/cli.md` with the same call

## Costly mistakes

- A stricter rule of twinspec can break the twin specs of the users
- For example a stricter `lib/spec.schema.json` breaks old front matter
- A stricter option of `ajv` or Handlebars can break old specs too
- Such a change needs a new version from [`docs/packages.md`](docs/packages.md#versions)

## See also

- [npm link](https://docs.npmjs.com/cli/v11/commands/npm-link) explains how a project uses a package from a folder
- [Contributor guidelines](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors) explain the job of `CONTRIBUTING.md`
