const fs = require('fs');
const path = require('path');

function required(value) {
  if (value == null) {
    process.exit(1);
  }
  return value;
}

const rootPath = required(process.argv[2]);
const packagePath = required(process.argv[3]);

const diff = path.relative(packagePath, rootPath);

fs.readdirSync(rootPath).forEach(file => {
  if (/tsconfig(\.\w+)?\.json/.test(file)) {
    const tsconfig = {
      extends: `${diff}/${file}`
    };

    fs.writeFileSync(`${packagePath}/${file}`, JSON.stringify(tsconfig, null, 2) + '\n');
  }
});
