import globals from "globals";
import js from "@eslint/js";
import type { Linter } from "eslint";

const customGlobals = {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    }
  }
};

export default [
  js.configs.recommended,
  customGlobals,
  {
    rules: {
      "no-console": [0],
    },
  },
] satisfies Linter.Config[];
