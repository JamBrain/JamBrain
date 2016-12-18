#!/bin/sh
# Run the setup scripts

# TODO: set a flag that will stop this script from running if already run

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

# Add Apache Ports and Domain Mappings
(cd apache ; sh add-ports.sh)

# Add Symlinks to output files
ln -s ../../.output/.build/public-ludumdare.com/all.js www/public-ludumdare.com/-/all.js
ln -s ../../.output/.build/public-ludumdare.com/all.css www/public-ludumdare.com/-/all.css
ln -s ../../.output/.build/public-ludumdare.com/all.svg www/public-ludumdare.com/-/all.svg
ln -s ../../.output/.build/public-jammer.vg/all.js www/public-jammer.vg/-/all.js
ln -s ../../.output/.build/public-jammer.vg/all.css www/public-jammer.vg/-/all.css
ln -s ../../.output/.build/public-jammer.vg/all.svg www/public-jammer.vg/-/all.svg
ln -s ../../.output/.build/public-jammer.bio/all.js www/public-jammer.bio/-/all.js
ln -s ../../.output/.build/public-jammer.bio/all.css www/public-jammer.bio/-/all.css
ln -s ../../.output/.build/public-jammer.bio/all.svg www/public-jammer.bio/-/all.svg

# Create tables
(cd /vagrant/www/src/shrub/tools; echo YES | php table-create)
