#!/bin/bash

if [ -z "$1" ]; then
	echo "Package is undefined!"
	exit 1
fi

packagePath=$1

cd "${packagePath}" || exit

echo "🚀️ Set up cross-env"

# cross-env 다운로드
echo "⚙️ Install cross-env"

npm i cross-env --save-dev

echo "✅ Finish"

echo "🎉 Finish to set up cross-env"
