import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import next from "eslint-config-next";

export default tseslint.config({ ignores: ["dist", ".next", "node_modules", "build"] }, next, {
  extends: [js.configs.recommended, ...tseslint.configs.strict],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  plugins: {
    "react-refresh": reactRefresh,
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true, allowExportNames: ["metadata", "useTheme"] },
    ],
    // Relax rules for development
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "react-hooks/exhaustive-deps": "off",
  },
});
