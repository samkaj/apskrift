# cd to where this file is located
cd "$(dirname "$0")"

# check if node is installed
if ! [ -x "$(command -v node)" ]; then
  echo 'Error: node is not installed.' >&2
  exit 1
fi

# check if npm is installed
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

# echo pwd into ROOT_DIR variable in .env
echo "ROOT_DIR=$(pwd)" > .env
