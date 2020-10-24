const fs = require('fs');
const path = require('path');
const required = require('./required');

const rootPath = required(process.argv[2]);
const packagePath = required(process.argv[3]);

const diff = path.relative(packagePath, rootPath);

const eslintrc = {
  extends: [
    `${diff}/.eslintrc.json`
  ]
};

fs.writeFileSync(`${packagePath}/.eslintrc.json`, JSON.stringify(eslintrc, null, 2) + '\n');
