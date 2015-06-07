#!/bin/sh
# This script adds the extra ports for other Ludum Dare services.
# i.e. 8080 for api.ludumdare.com, 8081 for static.ludumdare.com, etc.

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
cd $SCRIPTPATH

echo "Adding additional server ports to Apache"
cat apache-ports-conf.txt>>/etc/apache2/ports.conf
cat apache-default-conf.txt>>/etc/apache2/sites-available/000-default.conf

echo "Restarting Apache..."
apache2ctl restart
echo "Done (Apache Ports)."
