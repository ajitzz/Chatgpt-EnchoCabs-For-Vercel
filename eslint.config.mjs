// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["node_modules/**", ".next/**"] },

  // JS rules
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    rules: { ...js.configs.recommended.rules },
  },

  // TS rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      ...tseslint.configs.recommended[1].rules, // recommendedTypeChecked if you wire a tsconfig parser project
      "no-console": "off",
    },
  },
];
