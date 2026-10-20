# twinspec

Keep the texts of each code file in a twin Markdown spec

## Install

```sh
npm i twinspec
```

## Usage

```md
---
title: Greet
texts:
  welcomeUser: "Welcome {{userName}}"
---
Greet a user
```

```js
// lib/greet.js
import { TwinSpec } from 'twinspec'

export class GreetTool {
  static #greetSpec = TwinSpec.loadSpec()

  static formatWelcome (userName) {
    return GreetTool.#greetSpec.formatText('welcomeUser', { userName })
  }
}
```

```js
GreetTool.formatWelcome('Ana')   // 'Welcome Ana'
```

- The first file is `lib/greet.md`
- The function `loadSpec` reads `lib/greet.md` because the caller is `lib/greet.js`

## Contributing

- The repo takes only issues
- Open an issue for a question or a problem in [GitHub issues](https://github.com/tienhnguyen/twinspec/issues)
- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the rules of the project

## License

[MIT](LICENSE) © Tien H. Nguyen
