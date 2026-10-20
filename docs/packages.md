---
title: Packages
---
Read this before you add or publish a package

## Dependencies

- Add packages with `npm i`
- Let npm write the versions in `package.json`
- Sort `package.json` with `npx sort-package-json` after each change

## Publish

- Without `.npmignore` npm skips the files in `.gitignore`
- So CI publishes only the files in git
- So never put `files` in `package.json`
- Copy [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) of twinspec
- Keep the copy as it is
- Each push to `main` runs `npm test`
- Then a push with a new version publishes the package to npm
- Publish the first version of a new package yourself with `npm publish`
- Then add the repo as a trusted publisher of the package on npmjs.com
- Trusted publishing needs npm 11.5.1 or later
- Trusted publishing needs Node 22.14.0 or later

## Versions

- A change that breaks the projects of the users needs a new major version
- The range `^0.2.3` of npm takes only the versions below `0.3.0`
- So before version 1 such a change needs a new minor version

## See also

- [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json) explains `files` of npm
- [sort-package-json](https://github.com/keithamus/sort-package-json) explains the order of `package.json`
- [Trusted publishing](https://docs.npmjs.com/trusted-publishers) explains how to add the repo as a trusted publisher
- [node-semver](https://github.com/npm/node-semver) explains the version ranges of npm
