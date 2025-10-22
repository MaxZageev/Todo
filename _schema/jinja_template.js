const jinja = require("nunjucks");
const mapValues = require("lodash/mapValues");
const fs = require("fs");
const path = require("path");

function generateJinjaEnv(globals) {
  const jenv = new jinja.Environment();

  function expandEnv(obj) {
    if (Array.isArray(obj)) {
      return obj.map(expandEnv);
    }

    if (typeof obj === "object") {
      return mapValues(obj, (val) => expandEnv(val));
    }

    if (typeof obj === "string") {
      return obj.replace(/\$([a-z\d_]+)/gi, (_, varName) => {
        return process.env[varName] ?? "";
      });
    }

    return obj;
  }

  jenv.addFilter("jsonify", (obj) =>
    JSON.stringify(obj, null, "")?.replace(/"/g, '\\"'),
  );
  jenv.addFilter("jsonifypretty", (obj) =>
    JSON.stringify(obj, null, "  ")?.replace(/"/g, '\\"'),
  );
  jenv.addFilter("expandEnv", expandEnv);

  if (globals) {
    for (const [key, value] of Object.entries(globals)) {
      jenv.addGlobal(key, value);
    }
  }

  return jenv;
}

function getTemplate(tplFile, jenv, options) {
  const tplStr = fs.readFileSync(tplFile, "utf-8");

  const template = new jinja.Template(tplStr, jenv);
  const content = template.render();

  return content;
}

function writeTemplate(tplFile, jenv, output, options) {
  const tplStr = fs.readFileSync(tplFile, "utf-8");
  const content = getTemplate(tplFile, jenv, options);

  let outputPath = path.resolve(tplFile.replace(/\.j2$/, ""));

  const match = /{#\s*OUTPUT\s*=(.*)\s+\-?#}/gim.exec(tplStr);
  if (match) {
    outputPath = path.resolve(output, match[1].trim());
  } else {
    let fileName = path.basename(outputPath);
    outputPath = path.resolve(path.join(output, fileName));
  }

  if (!options.write && !options.quiet) {
    console.log(outputPath);
    console.log(content);
  }

  if (options.write) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(outputPath) && !options.force) {
      console.warn(`File ${outputPath} already exists. Skip`);
      return;
    }
    fs.writeFileSync(outputPath, content);
  }

  return content;
}

module.exports = {
  generateJinjaEnv,
  writeTemplate,
  getTemplate,
};
