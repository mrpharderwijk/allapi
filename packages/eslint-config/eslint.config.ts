import globals from "globals";
import js from "@eslint/js";
import type { Linter } from "eslint";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ...globals
    },
    rules: {
      "no-console": [0],
    },
  },
] satisfies Linter.Config[];
