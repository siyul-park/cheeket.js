#!/bin/bash

if [ -z "$1" ]; then
	echo "Root package is undefined!"
	exit 1
fi

if [ -z "$2" ]; then
	echo "Package is undefined!"
	exit 1
fi

rootPath=$1
packagePath=$2

scriptPath="${rootPath}/scripts"
templatePath="${rootPath}/templates/default"

cd "${packagePath}" || exit

echo "🚀️ Set up Typescript"

# typescript 다운로드
echo "⚙️ Install typescript"

npm i typescript --save-dev
npm i @types/node --save-dev

echo "✅ Finish"

# tsconfig 상속
echo "⚙️ Extend all tsconfig"

node "${scriptPath}/extend-tsconfigs.js" "${rootPath}" "${packagePath}"
node "${scriptPath}/merge-tsconfigs.js" "${templatePath}" "${packagePath}"

echo "✅ Finish"

echo "🎉 Finish to set up typescript"
