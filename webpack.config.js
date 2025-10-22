const HtmlWebpackPlugin = require("html-webpack-plugin");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
  container: { ModuleFederationPlugin },
  DefinePlugin
} = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const path = require("path");
const fs = require("fs");
const deps = require("./package.json").dependencies;

module.exports = (env, argv) => {
  const NODE_ENV = argv.mode || getEnv("NODE_ENV", "production", "str");

  require("dotenv-flow").config({ debug: true, node_env: NODE_ENV });

  function getEnv(envName, defValue, type = "boolean") {
    const data = env[envName] || process.env[envName] || defValue;
    let result;
    result = data;

    if (type === "boolean") result = !!data;

    console.info(envName, result);
    return result;
  }

  const NO_CONFIG = getEnv("NO_CONFIG", false);
  const NO_GZIP = getEnv("NO_GZIP", false);
  const NO_SOURCE_MAP = getEnv("NO_SOURCE_MAP", false);
  const ANALYZE = getEnv("ANALYZE", false);
  const VERSION = getEnv("VERSION", "0.1.0", "str");
  const GIT_COMMIT = getEnv("GIT_COMMIT", "HEAD", "str");
  const PUBLIC_PATH = getEnv("PUBLIC_PATH", "/", "str");
  const WEBPACK_PUBLICK_PATH = getEnv("WEBPACK_PUBLICK_PATH", "auto", "str");
  const MODULE_NAME = getEnv("MODULE_NAME", "example", "str");

  const IS_ENV_DEVELOPMENT = NODE_ENV === "development";
  const IS_ENV_PRODUCTION = NODE_ENV === "production";

  if (!NO_CONFIG) {
    if (!fs.existsSync("./config/config.json")) {
      throw new Error("No config file found, expect config.json");
    }
  } else {
    console.log("Skip config");
  }

  return {
    devServer: {
      open: "/",
      port: process.env.DEVSERVER_PORT || 4001,
      historyApiFallback: true,
      headers: {
        "Accept-Control-Allow-Origin": "*"
      },
      static: [
        {
          directory: "./public"
        }
      ],
      hot: false,
      client: false,
      liveReload: true,
    },
    target: ["browserslist"],
    mode: NODE_ENV,
    bail: IS_ENV_PRODUCTION,
    devtool: IS_ENV_PRODUCTION
      ? !NO_SOURCE_MAP
        ? "source-map"
        : false
      : IS_ENV_DEVELOPMENT && "cheap-module-source-map",
    entry: path.resolve("./src/index.tsx"),
    output: {
      path: path.resolve("./build"),
      filename: IS_ENV_PRODUCTION
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      assetModuleFilename: "static/media/[name].[hash][ext]",
      crossOriginLoading: "anonymous",
      publicPath: WEBPACK_PUBLICK_PATH,
      clean: true
    },
    optimization: {
      minimize: IS_ENV_PRODUCTION,
      splitChunks: {
        chunks: "all"
      }
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src")
      },
      fallback: {
        path: false,
        buffer: false
      }
    },
    module: {
      rules: [
        {
          loader: require.resolve("file-loader"),
          resourceQuery: /asfile/,
          type: "javascript/auto",
          options: {
            regExp: /.*node_modules[\/\\](.*$)/,
            name: "static/assets/[1]"
          }
        },
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },

        {
          test: /\.(scss|css)$/,
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { sourceMap: true, importLoaders: 1 }
            }
          ]
        },

        { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: "asset/resource" },
        { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: "asset/inline" }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({ async: false }),
      new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      VERSION: JSON.stringify(VERSION),
      GIT_COMMIT: JSON.stringify(GIT_COMMIT),
      BUILD_DATE: JSON.stringify(new Date().toISOString()),
      MODULE_NAME: JSON.stringify(MODULE_NAME),
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve("./src/index.html"),
        templateParameters: {
          PUBLIC_PATH,
          VERSION,
          GIT_COMMIT,
          STYLE_NONCE: getEnv("STYLE_NONCE", "", "str"),
          MODULE_NAME
        },
        publicPath: PUBLIC_PATH
      }),
      new GenerateJsonPlugin("app_version.json", {
        version: VERSION,
        hash: GIT_COMMIT
      }),
      !NO_CONFIG &&
        new CopyWebpackPlugin({
          patterns: [{ from: "config/config.json", to: "config.json", toType: "file" }]
        }),
      new CopyWebpackPlugin({ patterns: ["./public"] }),
      new ModuleFederationPlugin({
        name: MODULE_NAME,
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/app/entrypoints/RouteEntryPoint.tsx",
          "./VERSION": "./src/app/entrypoints/VersionEntryPoint.ts"
        },
        shared: {
          react: { requiredVersion: deps.react, singleton: true },
          "react-dom": {
            requiredVersion: deps["react-dom"],
            singleton: true
          },
          "react-router": {
            requiredVersion: deps["react-router"],
            singleton: true
          },
          "react-router-dom": {
            requiredVersion: deps["react-router-dom"],
            singleton: true
          },
          "@emotion/react": {
            requiredVersion: deps["@emotion/react"],
            singleton: true
          }
        }
      }),
      IS_ENV_PRODUCTION &&
        !NO_GZIP &&
        new CompressionPlugin({ exclude: ["index.html", "config.json"] }),
      ANALYZE && new BundleAnalyzerPlugin({ analyzerMode: "static" })
    ].filter(Boolean)
  };
};
