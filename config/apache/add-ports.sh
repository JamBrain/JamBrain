#!/bin/sh
# This script adds the extra ports for other Ludum Dare services.
# i.e. 8080 for api.ludumdare.com, 8081 for static.ludumdare.com, etc.

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

echo "Adding additional server ports to Apache"
cat apache-ports-conf.txt>>/etc/apache2/ports.conf
cat apache-default-conf.txt>/etc/apache2/sites-available/000-default.conf 

echo "Adding additional virtual hosts"
cat custom-port.conf>/etc/apache2/sites-available/custom-port.conf
cat jammer.conf>/etc/apache2/sites-available/jammer.conf
cat ludumdare.conf>/etc/apache2/sites-available/ludumdare.conf

ln -s ../sites-available/custom-port.conf /etc/apache2/sites-enabled/001-custom-port.conf
ln -s ../sites-available/jammer.conf /etc/apache2/sites-enabled/010-jammer.conf
ln -s ../sites-available/ludumdare.conf /etc/apache2/sites-enabled/011-ludumdare.conf

echo "Restarting Apache..."
apache2ctl restart
echo "Done (Apache Ports)."
