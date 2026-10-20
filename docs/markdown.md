---
title: Markdown
---
Read this before you write a Markdown file

## Files of a project

| File | Content | Reader | Page type | First sentence |
|---|---|---|---|---|
| `README.md` | The first page of the project | A user of the project | README | The description of the package |
| `CONTRIBUTING.md` | The rules of this project only | A maintainer of the project | Conceptual | What the file holds |
| A doc in `docs/` | A set of rules that many projects share | A maintainer of any project | Conceptual | `Read this before you {task}` |
| A twin spec | The spec of 1 code file | A reader of that code file | Reference | What the thing does |

- Write each fact in only 1 place
- Link to the place of a fact instead of a copy
- Standard Readme needs these copies of facts
  - The `description` of `package.json` in `README.md`
  - The `description` of `package.json` on the GitHub repo
  - The license of `LICENSE` in `README.md`
  - The `bugs` URL of `package.json` in `README.md`
- These copies are the only copies
- When the source of a copy changes change each copy

## Reading flow

```
README.md → CONTRIBUTING.md → docs/*.md → twin specs
```

- `README.md` links to `CONTRIBUTING.md`
- `README.md` links to no doc in `docs/`
- `CONTRIBUTING.md` links to each doc that the project follows
- A doc links to the twin specs that the doc talks about
- When you add a doc add its link to `CONTRIBUTING.md`
- When you move a file update each link to that file

## Front matter

```md
---
title: {Title}
---
{first sentence}

## {Section}
```

- Each `.md` file starts with front matter between 2 lines of `---`
- [`lib/spec.schema.json`](../lib/spec.schema.json) describes each key of the front matter
- The `title` of the front matter is the `#` line of the file
- So the body has no `#` line
- The headings of the body start at `##`
- `README.md` starts with a `#` line instead of front matter
- `CONTRIBUTING.md` starts with a `#` line instead of front matter

## First sentence

- The first sentence helps a reader see if the file is useful
- The help of [`TwinCli`](../presets/cli.md) prints the first sentence of each doc
- So the first sentence of a doc has no backticks

## Reference page

```md
## `{call}`

### Syntax

### Parameters

### Return value

### Exceptions

### Description

### Examples
```

- A reference page has 1 `##` section for each function that a reader calls
- A twin spec with no function for a reader has only the first sentence
- For example the twin spec of a test has only the first sentence
- Write the 6 sections in this order
- Write `None` in a section that has nothing
- Put a code block with each form of the call in `Syntax`
- Put 1 list item for each parameter in `Parameters`
- Put the type of the value in `Return value`
- Put the meaning of the value in `Return value`
- Put a table of the errors in `Exceptions`
- Each row of that table says when its error happens
- Put the steps in the order of the code in `Description`
- Put the rules after the steps in `Description`
- Put code with the result in a comment in `Examples`

## Rules

```md
- The {thing} {does what}
- When {event} the {thing} {does what}
- While {state} the {thing} {does what}
- If {bad case} then the {thing} {does what}
- Where {option} the {thing} {does what}
```

- Start each rule of a reference page like 1 of the 5 patterns above
- These 5 patterns come from EARS without the word `shall`

## Conceptual page

- A conceptual page has 1 `##` section for each topic
- Put `## See also` at the end of the file
- Link there to the official page of each standard
- Link there to the official page of each tool
- Link to a file of the project in the body

## README

```md
# {name of the package}

{description of the package}

## Install

## Usage

## Contributing

## License
```

- `README.md` follows Standard Readme
- The title is the name of the package
- Write only the 4 sections above
- Add `### CLI` in `## Usage` when the package has a command line
- Keep `README.md` under 100 lines
- So `README.md` needs no table of contents

## See also

- [MDN page types](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types) explain each type of page
- [MDN method template](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types/API_method_subpage_template) explains the sections of a reference page
- [MDN writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) explains the first sentence of a page
- [markdownlint MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md) treats the `title` of the front matter as the `#` line
- [EARS](https://alistairmavin.com/ears/) explains the 5 patterns of a rule
- [Standard Readme](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) explains the sections of `README.md`
