const tsj = require("ts-json-schema-generator");

function generateSchema(typeDefFile) {
  const config = {
    path: typeDefFile,
    type: "*",
    skipTypeCheck: true,
  };
  return tsj.createGenerator(config).createSchema();
}

module.exports = {
  generateSchema,
};
