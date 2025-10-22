module.exports = {
  ignore: ["node_modules/**/*"],
  presets: [
    ["@babel/preset-typescript"],
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-transform-modules-umd", { loose: true }],
    ["@babel/plugin-transform-classes", { loose: true }],
  ],
};
