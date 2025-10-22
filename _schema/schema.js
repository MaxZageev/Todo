#!/usr/bin/env node

/**
 * schema-tpl --src src/_ref/AppconfigData.ts --output build/ _templates/*.j2
 */

const yargs = require("yargs");

const { generateSchema } = require("./schema_utils");
const { generateJinjaEnv, writeTemplate } = require("./jinja_template");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 --src SRC [--output=OUT] TPL...")
  .env("SCHEMA")
  .option("src", {
    alias: ["s"],
    demandOption: true,
    nargs: 1,
    type: "string",
  })
  .option("node_env", {
    alias: ["c"],
    default: process.env.NODE_ENV ?? "production",
  })
  .option("output", {
    alias: ["o"],
    nargs: 1,
    default: process.cwd,
    type: "string",
  })
  .option("write", { alias: "w", default: false, type: "boolean" })
  .option("force", { alias: "f", default: false, type: "boolean" })
  .option("quiet", { alias: "q", default: false, type: "boolean" })
  .option("verbose", { alias: "v", default: false, type: "boolean" })
  .option("d", { alias: "D", nargs: 1, type: "array" })
  .demandCommand(1)
  .parse();

require("dotenv-flow").config({ debug: true, node_env: argv.node_env });

process.env.NODE_ENV = argv.node_env;

if (argv.verbose) {
  console.log(process.env);
}

const schema = generateSchema(argv.src);

if (argv.verbose) {
  console.log(JSON.stringify(schema, null, 2));
}

const cliGlobals = {};

if (argv.d) {
  for (option of argv.d) {
    const [key, value] = option.split("=");
    cliGlobals[key.trim()] = value;
  }
}

const jenv = generateJinjaEnv({
  env: process.env,
  schema,
  schemaString: JSON.stringify(schema, undefined, 2),
  ...cliGlobals,
});

for (let tpl of argv._) {
  writeTemplate(tpl, jenv, argv.output, argv);
}
