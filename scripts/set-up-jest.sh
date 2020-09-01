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

templatePath="${rootPath}/templates/default"

cd "${packagePath}" || exit

# jest 다운로드
echo "⚙️ Install jest"

npm i jest ts-jest --save-dev

echo "✅ Finish"

echo "🚀️ Set up jest"

# jest 설정
cp "${templatePath}/jest.config.js" "${packagePath}"

echo "🎉 Finish to set up jest"
