#!/bin/sh
# Run the setup scripts

# TODO: set a flag that will stop this script from running if already run

# TODO: Check if it's Apache or nginx.

cd /var/www/scripts
(cd apache ; sh add-ports.sh)

cd /var/www/scripts
(cd db ; echo YES | php table-create)
