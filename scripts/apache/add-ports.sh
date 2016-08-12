#!/bin/sh
# This script adds the extra ports for other Ludum Dare services.
# i.e. 8080 for api.ludumdare.com, 8081 for static.ludumdare.com, etc.

cd /var/www/scripts/apache

echo "Adding additional server ports to Apache"
cat apache-ports-conf.txt>>/etc/apache2/ports.conf
cat apache-default-conf.txt>/etc/apache2/sites-available/000-default.conf 

echo "Adding additional virtual hosts"
cat custom-port.conf>/etc/apache2/sites-available/custom-port.conf
cat jammer-work.conf>/etc/apache2/sites-available/jammer-work.conf
cat ludumdare-org.conf>/etc/apache2/sites-available/ludumdare-org.conf

ln -s ../sites-available/custom-port.conf /etc/apache2/sites-enabled/001-custom-port.conf
ln -s ../sites-available/jammer-work.conf /etc/apache2/sites-enabled/010-jammer-work.conf
ln -s ../sites-available/ludumdare-org.conf /etc/apache2/sites-enabled/011-ludumdare-org.conf

# Disable default ScotchBox mount
rm /etc/apache2/sites-enabled/scotchbox.local.conf

echo "Restarting Apache..."
apache2ctl restart
echo "Done (Apache Ports)."
