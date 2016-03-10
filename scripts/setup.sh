#!/bin/sh
# Run the setup scripts

# TODO: set a flag that will stop this script from running if already run

# TODO: Check if it's Apache or nginx.

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

(cd apache ; sh add-ports.sh)
(cd db ; echo YES | php table-create)
