// @ts-check

import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  solid.configs["flat/typescript"],
  {
    rules: {
      "solid/reactivity": [
        "warn",
        {
          customReactiveFunctions: ["getComments", "getNode", "getPath"],
        },
      ],
    },
  },
);
