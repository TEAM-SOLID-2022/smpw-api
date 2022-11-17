module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "eol-last": ["error", "never"],
    "linebreak-style": ["off", "windows"],
    "indent": ["off", 4],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["off", { "code": 120 }],
    "padded-blocks": ["error", { "blocks": "always", "classes": "always", "switches": "always" }],
  },
};