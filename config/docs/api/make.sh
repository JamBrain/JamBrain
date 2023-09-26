#!/bin/sh

# check if nodejs is availabe
if [ -z `which nodejs` ]; then
    echo "Generating this documentation requires 'nodejs' package. Please install and try again."
    exit 1
fi

# check if node is availabe
if [ -z `which node` ]; then
    echo "There's a problem with your 'nodejs' installation. No 'node' command found."
    echo "You might need to create a symlink, like so:"
    echo ""
    echo "sudo ln -s `which nodejs` `dirname \`which nodejs\``/node"
    exit 1
fi

# check if apidoc exists
if [ -z `which apidoc` ]; then
	# check if node is availabe
	if [ -z `which npm` ]; then
	    echo "Generating this documentation requires 'npm' package (node.js). Please install and try again."
	    exit 1
	fi
	
	echo "node-apidoc is missing. Installing..."
    sudo npm install -g apidoc apidoc-markdown
    if [ $? -ne 0 ]; then
    	echo "Problem installing apidoc."
    	exit 1
    fi
fi

apidoc -i ../../../public-api -o output/
apidoc-markdown -p output -o output/README.md
