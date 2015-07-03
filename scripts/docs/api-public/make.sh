#!/bin/sh

# check if node is availabe
if [ -z `which node` ]; then
    echo "Generating this documentation requires 'Node.js'. Please install and try again."
    exit 1
fi

# check if apidoc exists
if [ -z `which apidoc` ]; then
	echo "node-apidoc is missing. Installing..."
    sudo npm install -g apidoc apidoc-markdown
    if [ $? -ne 0 ]; then
    	echo "Problem installing apidoc. Exitting..."
    	exit 1
    fi
fi

apidoc -i ../../../public-api -o output/
apidoc-markdown -p output -o output/README.md
