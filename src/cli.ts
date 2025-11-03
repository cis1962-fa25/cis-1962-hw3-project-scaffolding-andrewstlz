#!/usr/bin/env node
import { parseArgs } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { validatePizza } from "./index";

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      pretty: { type: "boolean", short: "p" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    const bin = path.basename(process.argv[1] ?? "pizza-validate");
    console.log(`Usage: ${bin} <path/to/pizza.json> [--pretty]
            Options:
            -p, --pretty Pretty-print JSON output
            -h, --help Show this help`);
    process.exit(0);
  }

  const file = positionals[0];
  try {
    const txt = await fs.readFile(file, "utf8"); // file exists
    const obj = JSON.parse(txt); // file is valid json
    const result = validatePizza(obj); // pass object to validator function
    console.log(JSON.stringify(result, null, values.pretty ? 2 : 0)); // print validation result
    process.exit(result.isPizza ? 0 : 1); // whether program succeeded
  } catch (err: any) {
    console.error(`Error: ${err?.message ?? String(err)}`);
    process.exit(1);
  }
}

main();
