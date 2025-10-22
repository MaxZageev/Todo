module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@emotion", { sourceMap: true, autoLabel: "dev-only", labelFormat: "[local]" }],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: { src: "./src" },
        extensions: [".js", ".ts", ".tsx"]
      }
    ]
  ]
};
