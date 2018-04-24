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

# Create upload folders
mkdir /vagrant/www/public-static/content
mkdir /vagrant/www/public-static/raw
ln -s ../internal /vagrant/www/public-static/raw/internal

# Setup Sphinx
mv /etc/sphinxsearch/sphinx.conf /etc/sphinxsearch/_sphinx.conf
ln -s /vagrant/www/private-search/sphinx.conf /etc/sphinxsearch/sphinx.conf
ln -s /var/lib/sphinxsearch/data /home/vagrant/sphinx-data
ln -s /vagrant/www/private-search/sphinx.conf /home/vagrant/sphinx.conf
service sphinxsearch restart
