import globals from "globals";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.expo/**",
            "**/coverage/**",
        ],
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        extends: [js.configs.recommended],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.strict],

        languageOptions: {
            globals: globals.node,
        },
    },
);
