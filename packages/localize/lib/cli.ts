/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import "source-map-support/register.js";

import { fileURLToPath } from "url";
import * as fs from "fs/promises";
import * as path from "path";
import minimist from "minimist";

import { KnownError, unreachable } from "@lit/localize-tools/lib/error.js";
import { LitLocalizer } from "@lit/localize-tools/lib/index.js";
import { printDiagnostics } from "@lit/localize-tools/lib/typescript.js";
import { readConfigFileAndWriteSchema } from "@lit/localize-tools/lib/config.js";
import { RuntimeLitLocalizer } from "@lit/localize-tools/lib/modes/runtime.js";
import type { Config } from "@lit/localize-tools/lib/types/config.js";
import type { RuntimeOutputConfig } from "@lit/localize-tools/lib/types/modes.js";

const usage = `
Usage: fw-localize [--config=lit-localize.json] COMMAND

Commands:
  extract     Extract messages from source files

Options:
  --help      Display this help message.
  --config    Path to JSON configuration file.
              Default: ./lit-localize.json
              See https://github.com/lit/lit/tree/main/packages/localize#readme for details.
`;

const commands = ["extract"] as const;
type Command = (typeof commands)[number];
const isCommand = (str: string): str is Command =>
  commands.includes(str as Command);

interface CliOptions {
  config: Config;
  command: Command;
}

export async function runAndExit() {
  const exitCode = await runAndLog(process.argv);
  process.exit(exitCode);
}

export async function runAndLog(argv: string[]): Promise<number> {
  let config;
  try {
    const cliOpts = cliOptsFromArgs(argv);
    config = cliOpts.config;
    await runAndThrow(cliOpts);
  } catch (err) {
    if (err instanceof KnownError) {
      console.error(err.message);
    } else {
      console.error("Unexpected error\n");
      console.error((err as Error).message);
      console.error();
      console.error((err as Error).stack);
    }
    console.log();
    console.log(`Version: ${await version()}`);
    console.log(`Args: ${argv.slice(2).join(" ")}`);
    if (config) {
      console.log(`Config:`, JSON.stringify(config, null, 2));
    }
    console.log();
    return 1;
  }
  return 0;
}

async function version() {
  const packageJsonPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "package.json"
  );
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, "utf8")
  ) as { version: number; };
  return packageJson.version;
}

async function runAndThrow({ config, command }: CliOptions) {
  const localizer = makeLocalizer(config);

  if (command === "extract") {
    // TODO(aomarks) Don"t even require the user to have configured their output
    // mode if they"re just doing extraction.
    const { messages } = localizer.extractSourceMessages();
    if (!messages.length) return;

    const strings = messages.filter(message => message.contents.every(content => typeof content === "string")).map(({ contents }) => contents).flat(1);
    console.log("Extracted content:\n ".concat(strings.join(", ")));
  } else {
    // Should already have been validated.
    throw new KnownError(
      `Internal error: unknown command ${unreachable(command)}`
    );
  }
}

function makeLocalizer(config: Config): LitLocalizer {
  switch (config.output.mode) {
    case "runtime":
      return new RuntimeLitLocalizer(
        config as Config & { output: RuntimeOutputConfig; }
      );
    default:
      throw new KnownError(
        `Internal error: unknown mode ${(unreachable(config.output as never) as Config["output"]).mode
        }`
      );
  }
}

function cliOptsFromArgs(argv: string[]): CliOptions {
  const args = minimist(argv.slice(2));
  if (args._.length === 0) {
    throw new KnownError(
      `Missing command argument. ` +
      `Valid commands: ${[...commands].join(", ")}`
    );
  }
  const command = args._[0];
  if (!isCommand(command)) {
    throw new KnownError(
      `Invalid command ${command}}. ` +
      `Valid commands: ${[...commands].join(", ")}`
    );
  }
  if (args._.length > 1) {
    throw new KnownError(
      `Unknown argument(s): ${args._.slice(1).join(" ")}` + usage
    );
  }
  if ("help" in args) {
    throw new KnownError(usage);
  }
  const configPath = args["config"] || "./localize.json";
  const config = readConfigFileAndWriteSchema(configPath);
  return { config, command };
}
