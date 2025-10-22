module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "feature",
        "fix",
        "improvement",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "bump",
      ],
    ],
  },
  ignores: [
    (message) =>
      message.startsWith("Merge in" || message.startsWith("Pull request #")),
  ],
};
