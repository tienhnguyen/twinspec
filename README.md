# twinspec

Keep the texts of each code file in a twin Markdown spec

## Install

```sh
npm i twinspec
```

## Usage

```md
---
# tools/greet.md
title: Greet
description: "The GreetTool class greets a user"
texts:
  welcomeUser: "Welcome {{userName}}"
---
```

```js
// tools/greet.js
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

## Contributing

- The repo takes only issues
- Open an issue for a question or a problem in [GitHub issues](https://github.com/tienhnguyen/twinspec/issues)
- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the rules of the project

## License

[MIT](LICENSE) © Tien H. Nguyen
