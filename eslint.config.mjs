/** This file is for eslint configuration; 
 *  for config rules, see https://eslint.org/docs/latest/use/configure/ 
 */

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {files: ["backend/**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {files: ["frontend/**/*.jsx"], languageOptions: {sourceType: "module"}},
  // {files: ["**/*.jsx"], languageOptions: {sourceType: "module"}},
  {languageOptions: { 
    // NOTES-FOR-DEVELOPER: global variables docs https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
    globals: globals.browser 
  }},
];