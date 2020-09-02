const fs = require('fs');
const path = require('path');

const required = require('./required');

const rootPath = required(process.argv[2]);
const packagePath = required(process.argv[3]);

const eslintrcJson = require(`${rootPath}/.eslintrc.json`);

const { project } = eslintrcJson.parserOptions;

const diff = path.relative(rootPath, packagePath);

project.push(`${diff}/tsconfig.json`);

fs.writeFileSync(`${rootPath}/.eslintrc.json`, JSON.stringify(eslintrcJson, null, 2) + '\n');
