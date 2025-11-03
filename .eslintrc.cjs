module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: { node: true, es2020: true, jest: true },
  rules: {
    // ≥4 non-default rules:
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "no-trailing-spaces": "error",
    "prefer-const": "error",
    // TS-specific tightening:
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off", // okay for CLI
  },
  overrides: [
    {
      files: ["src/cli.ts"],
      rules: {
        // Allow console in CLI
        "no-console": "off",
      },
    },
  ],
};
