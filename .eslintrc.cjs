/** @type @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "standard-with-typescript",
    "prettier"
  ],
  overrides: [
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    quotes: ["error", "double"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
  }
}
