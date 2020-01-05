module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:import/typescript',
    'plugin:prettier/recommended' // must be the last config entry
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  env: {
    node: true
  },
  rules: {
    "@typescript-eslint/camelcase": [1, { "properties": "always" }],
  }
}