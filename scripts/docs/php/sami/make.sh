#!/bin/sh

# check if nodejs is availabe
if [ -z `which php` ]; then
	echo "Generating this documentation requires 'php' package. Please install and try again."
	exit 1
fi

# check if apidoc exists
if [ ! -f sami.phar ]; then
	echo "sami.phar is missing. Installing..."
	curl -O http://get.sensiolabs.org/sami.phar
	if [ $? -ne 0 ]; then
		echo "Problem installing sami.phar"
		exit 1
	fi
	chmod +x sami.phar
fi

./sami.phar update config.php
