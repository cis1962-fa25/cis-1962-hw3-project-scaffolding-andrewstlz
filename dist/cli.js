#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const index_1 = require("./index");
async function main() {
    const { values, positionals } = (0, node_util_1.parseArgs)({
        options: {
            pretty: { type: "boolean", short: "p" },
            help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
    });
    if (values.help || positionals.length === 0) {
        const bin = node_path_1.default.basename(process.argv[1] ?? "pizza-validate");
        console.log(`Usage: ${bin} <path/to/pizza.json> [--pretty]
            Options:
            -p, --pretty Pretty-print JSON output
            -h, --help Show this help`);
        process.exit(0);
    }
    const file = positionals[0];
    try {
        const txt = await promises_1.default.readFile(file, "utf8"); // file exists
        const obj = JSON.parse(txt); // file is valid json
        const result = (0, index_1.validatePizza)(obj); // pass object to validator function
        console.log(JSON.stringify(result, null, values.pretty ? 2 : 0)); // print validation result
        process.exit(result.isPizza ? 0 : 1); // whether program succeeded
    }
    catch (err) {
        console.error(`Error: ${err?.message ?? String(err)}`);
        process.exit(1);
    }
}
main();
