const path = require("path");
const fs = require("fs");
const ts = require("typescript");

const locales = ["ru"];
const output = "src/shared/config/i18n/locales/$LOCALE/$NAMESPACE.json";

const KEY_PREFIX_NAME = "keyPrefix";
const NO_KEY_SEPARATOR = '__!NO_KEY_SEPARATOR!__';
const NO_NAMESPACE_SEPARATOR = '__!NO_NAMESPACE_SEPARATOR!__';

const isKeyPrefixProperty = (name) => {
  if (!name) {
    return false;
  }

  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name) ||
    ts.isNoSubstitutionTemplateLiteral(name)
  ) {
    return name.text === KEY_PREFIX_NAME;
  }

  return false;
};

const extractKeyPrefix = (callExpression) => {
  for (const arg of callExpression.arguments) {
    if (!ts.isObjectLiteralExpression(arg)) {
      continue;
    }

    for (const prop of arg.properties) {
      if (!ts.isPropertyAssignment(prop) || !isKeyPrefixProperty(prop.name)) {
        continue;
      }

      const { initializer } = prop;
      if (
        ts.isStringLiteral(initializer) ||
        ts.isNoSubstitutionTemplateLiteral(initializer)
      ) {
        return initializer.text;
      }
    }
  }

  return null;
};

const collectTranslatorBindings = (sourceFile) => {
  const bindings = new Map();

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer)
    ) {
      const call = node.initializer;
      const callee = call.expression;
      const isUseTranslationCall =
        (ts.isIdentifier(callee) && callee.text === "useTranslation") ||
        (ts.isPropertyAccessExpression(callee) && callee.name.text === "useTranslation");

      if (!isUseTranslationCall) {
        ts.forEachChild(node, visit);
        return;
      }

      const prefix = extractKeyPrefix(call);
      if (!prefix) {
        ts.forEachChild(node, visit);
        return;
      }

      if (ts.isObjectBindingPattern(node.name)) {
        for (const element of node.name.elements) {
          if (element.dotDotDotToken) {
            continue;
          }

          if (!element.name || !ts.isIdentifier(element.name)) {
            continue;
          }

          const bindingName = element.name.text;
          let sourceName = bindingName;

          if (element.propertyName) {
            const { propertyName } = element;
            if (ts.isIdentifier(propertyName) || ts.isStringLiteral(propertyName)) {
              sourceName = propertyName.text;
            } else {
              continue;
            }
          }

          if (sourceName === "t") {
            bindings.set(bindingName, prefix);
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return bindings;
};

const isStaticString = (node) =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);

const applyKeyPrefix = (code, filename) => {
  const scriptKind = ts.getScriptKindFromFileName(filename) || ts.ScriptKind.TSX;
  const sourceFile = ts.createSourceFile(
    filename,
    code,
    ts.ScriptTarget.ESNext,
    true,
    scriptKind
  );

  const bindings = collectTranslatorBindings(sourceFile);
  if (!bindings.size) {
    return code;
  }

  const transformer = (context) => {
    const { factory } = context;

    const visit = (node) => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const prefix = bindings.get(node.expression.text);

        if (prefix) {
          const [firstArg] = node.arguments;

          if (firstArg && isStaticString(firstArg)) {
            const prefixedKey = `${prefix}.${firstArg.text}`;
            if (prefixedKey !== firstArg.text) {
              const restArgs = Array.from(node.arguments).slice(1);
              const newArgs = [factory.createStringLiteral(prefixedKey), ...restArgs];
              return factory.updateCallExpression(
                node,
                node.expression,
                node.typeArguments,
                factory.createNodeArray(newArgs)
              );
            }
          }
        }
      }

      return ts.visitEachChild(node, visit, context);
    };

    return (node) => ts.visitNode(node, visit);
  };

  const result = ts.transform(sourceFile, [transformer]);
  const transformed = result.transformed[0];
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const outputCode = printer.printFile(transformed);
  result.dispose();

  return outputCode;
};

module.exports = {
  locales,
  output,
  defaultValue: "",
  keepRemoved: false,
  keySeparator: ".",
  nsSeparator: false,
  createOldCatalogs: false,
  lexers: {
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],
    js: ["JavascriptLexer"],
    jsx: ["JsxLexer"],
    default: ["JavascriptLexer"]
  },
  transform(file, enc, done) {
    const parser = this.parser;
    const options = this.options || {};

    let contents = "";
    if (file.isBuffer && file.isBuffer()) {
      contents = file.contents.toString("utf8");
    } else if (file.path && fs.existsSync(file.path) && fs.statSync(file.path).isFile()) {
      contents = fs.readFileSync(file.path, "utf8");
    } else {
      done();
      return;
    }

    const filename = file.path || path.join(process.cwd(), file.relative || path.basename(file.path || ""));

    let adjusted = contents;
    try {
      adjusted = applyKeyPrefix(contents, filename);
    } catch (error) {
      this.emit(
        "warning",
        `Failed to apply keyPrefix transform for ${filename}: ${error.message}`
      );
    }

    const entries = parser.parse(adjusted, path.basename(filename));

    for (const entry of entries) {
      let key = entry.key;

      if (entry.keyPrefix) {
        const prefixPath = `${entry.keyPrefix}${options.keySeparator}`;
        if (!key.startsWith(prefixPath)) {
          key = `${entry.keyPrefix}${options.keySeparator}${key}`;
        }
        delete entry.keyPrefix;
      }

      const namespaceSeparator = options.namespaceSeparator || NO_NAMESPACE_SEPARATOR;
      const keySeparator = options.keySeparator || NO_KEY_SEPARATOR;

      const parts = key.split(namespaceSeparator);
      if (parts.length > 1 && key !== entry.defaultValue) {
        entry.namespace = parts.shift();
      }

      entry.namespace = entry.namespace || options.defaultNamespace || "translation";
      key = parts.join(namespaceSeparator);

      key = key.replace(/\\('|"|`)/g, "$1");
      key = key.replace(/\\n/g, "\n");
      key = key.replace(/\\r/g, "\r");
      key = key.replace(/\\t/g, "\t");
      key = key.replace(/\\\\/g, "\\");

      entry.key = key;
      entry.keyWithNamespace = `${entry.namespace}${keySeparator}${key}`;

      this.addEntry(entry);
    }

    done();
  }
};
