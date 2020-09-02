const fs = require('fs');
const required = require('./required');

const sourcePackagePath = required(process.argv[2]);
const sourcePackageJson = require(sourcePackagePath);

const targetPackagePath = required(process.argv[3]);
const targetPackageJson = require(targetPackagePath);

const key = required(process.argv[4]);

const tokens = key.split('.').reverse();

let source = sourcePackageJson;
let target = targetPackageJson;
while (tokens.length > 1) {
  const token = tokens.pop();

  if (source[token] == null) {
    process.exit(1);
  }
  if (target[token] == null) {
    target[token] = {};
  }

  source = source[token];
  target = target[token];
}

const token = tokens.pop();
target[token] = source[token];

fs.writeFileSync(targetPackagePath, JSON.stringify(targetPackageJson, null, 2) + '\n');
