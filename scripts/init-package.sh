#!/bin/bash

if [ -z "$1" ]; then
	echo "Package location is undefined!"
	exit 1
fi

if [ -z "$2" ]; then
	echo "Package name is undefined!"
	exit 1
fi

packageLocation=$1
packageName=$2

rootPath=$(pwd)
scriptPath="${rootPath}/scripts"
templatePath="${rootPath}/templates/default"

echo "🚀 Start to creat new package ${packageName} in ${packageLocation}..."

# 패키지 생성
echo "⚙️ Init ${packageName}"

mkdir "${packageLocation}"
cd "${packageLocation}" || exit
mkdir "${packageName}"
cd "${packageName}" || exit

packagePath=$(pwd)

npm init

echo "✅ Finish"

# Typescript 세팅
sh "${scriptPath}/set-up-typescript.sh" "${rootPath}" "${packagePath}"

# cross env 세팅
sh "${scriptPath}/set-up-cross-env.sh" "${packagePath}"

# gulp 세팅
sh "${scriptPath}/set-up-gulp.sh" "${rootPath}" "${packagePath}"

# lint 세팅
sh "${scriptPath}/set-up-lint.sh" "${rootPath}" "${packagePath}"

# jest 세팅
sh "${scriptPath}/set-up-jest.sh" "${rootPath}" "${packagePath}"

# package.json 수정
sh "${scriptPath}/add-default-script-in-package.sh" "${templatePath}" "${packagePath}" "${scriptPath}"

# 기본 파일 세팅
echo "⚙️ set up default file"

cp -r "${templatePath}/lib" "${packagePath}"

echo "✅ Finish"

# npm ignore
echo "⚙️ copy npm ignore"

cp "${rootPath}"/.npmignore "${packagePath}"

echo "✅ Finish"

# git
echo "⚙️ copy git ignore"

cp "${rootPath}"/.gitignore "${packagePath}"
git add .

echo "✅ Finish"

echo "🎉 Finish to install ${packageName} in ${packageLocation}"
