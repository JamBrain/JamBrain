#!/bin/sh
# Run the setup scripts

# TODO: set a flag that will stop this script from running if already run

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

# Add Apache Ports and Domain Mappings
(cd apache ; sh add-ports.sh)

# Add Symlinks to output files
ln -svf ../../.output/.build/public-ludumdare.com/all.js /vagrant/www/public-ludumdare.com/-/all.js
ln -svf ../../.output/.build/public-ludumdare.com/all.css /vagrant/www/public-ludumdare.com/-/all.css
ln -svf ../../.output/.build/public-ludumdare.com/all.svg /vagrant/www/public-ludumdare.com/-/all.svg
ln -svf ../../.output/.build/public-jammer.vg/all.js /vagrant/www/public-jammer.vg/-/all.js
ln -svf ../../.output/.build/public-jammer.vg/all.css /vagrant/www/public-jammer.vg/-/all.css
ln -svf ../../.output/.build/public-jammer.vg/all.svg /vagrant/www/public-jammer.vg/-/all.svg
ln -svf ../../.output/.build/public-jammer.bio/all.js /vagrant/www/public-jammer.bio/-/all.js
ln -svf ../../.output/.build/public-jammer.bio/all.css /vagrant/www/public-jammer.bio/-/all.css
ln -svf ../../.output/.build/public-jammer.bio/all.svg /vagrant/www/public-jammer.bio/-/all.svg

# Install fork of buble
sudo npm install -g Noojuno/buble
(cd /vagrant/www/; sudo npm install)

# Create tables
(cd /vagrant/www/src/shrub/tools; echo YES | php table-create)
