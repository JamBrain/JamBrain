#!/bin/sh
# Run the setup scripts

# TODO: set a flag that will stop this script from running if already run

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

# Add Apache Ports and Domain Mappings
(cd apache ; sh add-ports.sh)

# Create tables
(cd /vagrant/www/src/shrub/tools; echo YES | php table-create)
