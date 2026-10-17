import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig, globalIgnores } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import { configs as tseslintConfigs } from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**", "watch.js", "vite.config.ts.timestamp-*"]),

  js.configs.recommended,
  tseslintConfigs.recommended,
  eslintReact.configs["recommended-typescript"],
  eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"],
  reactHooks.configs.flat.recommended,
  pluginQuery.configs["flat/recommended"],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  tailwindcss.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, chrome: "readonly" },
    },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
      tailwindcss: { cssConfigPath: "./src/assets/styles/tailwind.css" },
    },
    rules: {
      "arrow-body-style": "error",
      "block-scoped-var": "error",
      curly: "error",
      "default-case-last": "error",
      "default-case": "error",
      "default-param-last": "error",
      "dot-notation": "error",
      eqeqeq: "error",
      "max-lines": ["error"],
      "multiline-comment-style": "error",
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-else-return": "warn",
      "no-empty": "error",
      "no-extra-boolean-cast": "warn",
      "no-implicit-globals": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-template-curly-in-string": "error",
      "no-unneeded-ternary": "warn",
      "no-useless-rename": "warn",
      "no-var": "error",
      "no-warning-comments": "warn",
      "operator-assignment": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": "warn",
      "prefer-rest-params": "warn",
      "require-await": "error",
      "sort-vars": "warn",
      "tailwindcss/no-custom-classname": ["warn", { whitelist: ["not-prose"] }],
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "unknown",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  {
    // Tests use dummy class names, and cn() takes arbitrary class names.
    files: ["**/*.test.ts", "src/utils/cn.ts"],
    rules: { "tailwindcss/no-custom-classname": "off" },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  prettierRecommended,
]);
