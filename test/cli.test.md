---
$schema: twinspec/cli.schema.json
title: Command line test
description: "The `CliTest` class tests the preset `twinspec/cli`"
commands:
  audit:
    description: Audit a library folder
    inputSchema:
      type: object
      properties:
        library:
          type: string
          title: folder
          description: The path of the library folder
        fix:
          type: boolean
          description: Fix the findings
      required: [library]
    examples:
      - args: --library ./lib
        description: Audit the lib folder
  exec:
    description: Run a raw command
texts:
  testHelp: "help lists the commands of the client"
  testDocsOnce: "help lists each doc of twinspec 1 time when the client is twinspec"
  testClientDocs: "help sorts the docs of the client among the docs of twinspec"
  testVersion: "version shows the version of the package"
  testOptions: "parseArgs reads the options of inputSchema"
  testUnknownCommand: "unknownCommand fills the name of the command"
  testOptionMissing: "optionMissing fills the name of the missing option"
  testCommandError: "commandError puts the name of the package before the error"
  testBrokenCommand: "cli.schema.json stops a command without a description"
  testCliSchemaMissing: "loadCli throws cliSchemaMissing when the spec has no $schema"
  testPackageMissing: "loadCli throws packageMissing when no folder has a package.json"
  testPackageFieldMissing: "loadCli throws packageFieldMissing when package.json has no version"
  testBugsString: "loadCli reads the URL of bugs from a string"
  testValueTaken: "formatText throws valueTaken for a value from loadCli"
  testTextIds: "presets/cli.js uses only the texts of presets/cli.md"
  expectedHelp: |-
    {{packageDescription}}

    Usage: npx {{packageName}} <command>

    Examples:
      npx {{packageName}} audit --library ./lib
        Audit the lib folder

    Commands:
      audit [options]
        Audit a library folder
        --library <folder>
          The path of the library folder
        --fix
          Fix the findings
        The option --library is required
      exec [args...]
        Run a raw command

    Flags:
      -h --help
        Show this help
      --version
        Show the version
---
