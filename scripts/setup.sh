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

# Create upload folders if they don't exist
mkdir -p /vagrant/www/public-static/content
mkdir -p /vagrant/www/public-static/raw
ln -sfn ../internal /vagrant/www/public-static/raw/internal

# Setup Sphinx
mv /etc/sphinxsearch/sphinx.conf /etc/sphinxsearch/_sphinx.conf
ln -sfn /vagrant/www/private-search/sphinx.conf /etc/sphinxsearch/sphinx.conf
ln -sfn /var/lib/sphinxsearch/data /home/vagrant/sphinx-data
ln -sfn /vagrant/www/private-search/sphinx.conf /home/vagrant/sphinx.conf
service sphinxsearch restart
