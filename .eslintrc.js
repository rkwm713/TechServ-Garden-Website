module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    // Error prevention
    "no-var": "error",
    "prefer-const": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-debugger": "warn",
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    
    // Code style consistency
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["warn", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "comma-dangle": ["warn", "always-multiline"],
    "arrow-parens": ["warn", "as-needed"],
    
    // Modern JavaScript
    "arrow-body-style": ["warn", "as-needed"],
    "object-shorthand": "warn",
    "prefer-template": "warn",
    "prefer-destructuring": ["warn", {
      "array": false,
      "object": true
    }],
    
    // Better practices
    "max-len": ["warn", { "code": 100, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
    "max-depth": ["warn", 4],
    "max-params": ["warn", 4],
    "max-nested-callbacks": ["warn", 3],
    "max-statements": ["warn", 30],
    "complexity": ["warn", 15]
  }
};
