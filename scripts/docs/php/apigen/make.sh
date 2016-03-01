#!/bin/sh

# check if nodejs is availabe
if [ -z `which composer` ]; then
    echo "Generating this documentation requires php 'composer' package. Please install and try again."
    exit 1
fi

# check if apidoc exists
if [ -z ~/.composer/vendor/bin/apigen ]; then
	echo "composer-apigen is missing. Installing..."
    composer global require --dev apigen/apigen
    if [ $? -ne 0 ]; then
    	echo "Problem installing apigen."
    	exit 1
    fi
fi

~/.composer/vendor/bin/apigen generate -s ../../../core -d output
