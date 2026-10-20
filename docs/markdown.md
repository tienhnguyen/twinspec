---
title: Markdown
---
Read this before you write a Markdown file

## Files of a project

| File | Content | Reader |
|---|---|---|
| `README.md` | The first page of the project | A user of the project |
| `CONTRIBUTING.md` | The rules of this project only | A maintainer of the project |
| A doc in `docs/` | A set of rules that many projects share | A maintainer of any project |
| A twin spec | The spec of 1 code file | A reader of that code file |

- Put a rule of 1 project in the `CONTRIBUTING.md` of that project
- Put a rule that many projects share in a doc in `docs/`
- Write each fact in only 1 place
- Link to the place of a fact instead of a copy
- The description of a package is the only fact with 3 copies
  - The `description` of `package.json`
  - The line after the title of `README.md`
  - The description of the repo on GitHub
- Standard Readme needs these copies
- When the description changes change each copy

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
- When a fact changes change the fact only in its 1 place

## Front matter

```md
---
title: {Title}
---
{first sentence}

## {Section}
```

- Each `.md` file starts with front matter between 2 lines of `---`
- The front matter has a `title`
- The `title` is the `#` line of the file
- So the body has no `#` line
- The headings of the body start at `##`
- `README.md` has no front matter
- `CONTRIBUTING.md` has no front matter
- These 2 files start with a `#` line

## First sentence

| File | First sentence |
|---|---|
| A twin spec | What the thing does |
| A doc in `docs/` | `Read this before you {task}` |
| `README.md` | The description of the package |
| `CONTRIBUTING.md` | What the file holds |

- The first sentence helps a reader see if the file is useful
- The help of `TwinCli` prints the first sentence of each doc
- So the first sentence of a doc has no backticks

## Page types

| File | Page type |
|---|---|
| The twin spec of a code file | Reference |
| A preset | Reference |
| A doc in `docs/` | Conceptual |
| `README.md` | Conceptual |
| `CONTRIBUTING.md` | Conceptual |

- A reference page has 1 `##` section for each function that a reader calls
- A conceptual page has 1 `##` section for each topic
- A twin spec with no function for a reader has only the first sentence
- For example the twin spec of a test has only the first sentence

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
- Link to another file when a section has the same content as that file

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

- Put the main code or table at the top of each section
- Put `## See also` at the end of the file
- Link there to the official page of each standard
- Link there to the official page of each tool

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
- So `README.md` ends with `## License`
- So `README.md` has no `## See also`
- Keep `README.md` under 100 lines
- So `README.md` needs no table of contents

## See also

- [MDN page types](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types) explain each type of page
- [MDN method template](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types/API_method_subpage_template) explains the sections of a reference page
- [MDN writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) explains the first sentence of a page
- [markdownlint MD025](https://github.com/DavidAnson/markdownlint/blob/main/doc/md025.md) treats the `title` of the front matter as the `#` line
- [EARS](https://alistairmavin.com/ears/) explains the 5 patterns of a rule
- [Standard Readme](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) explains the sections of `README.md`
