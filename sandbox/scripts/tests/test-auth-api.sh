#!/bin/bash

TARGET=http://192.168.48.48:8081/v1
USER=dummy
PASSWORD=1111
TWOFACTOR=1234

if [ -n "$1" ]; then
	TARGET=$1
fi

echo "Base URL: ${TARGET}"

# Tests for login
CMD="/login"
ARGS=(
""
"l=${USER}"
"l=${USER}&p=${PASSWORD}"
"l=${USER}&p=${PASSWORD}&tf=${TWOFACTOR}"
)

for i in "${ARGS[@]}"
do 
	echo "Test: ${CMD} with ${i}"
	curl --data "${i}" $TARGET$CMD?pretty
	echo ""
done

# Tests for logout
