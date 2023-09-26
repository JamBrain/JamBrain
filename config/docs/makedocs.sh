#!/bin/sh
echo "API-Internal (Internal REST API Documentation): output/index.html and output/README.md"
(cd api-internal ; sh make.sh)
echo ""

echo "API-Public (Public REST API Documentation): output/index.html and output/README.md"
(cd api-public ; sh make.sh)
echo ""

echo "PHP (Server Side Source Code): output/index.html"
$(cd php; sh make.sh)
echo ""

echo "JavaScript (Client Side Source Code): output/index.html output/README.md"
$(cd javascript; sh make.sh)
echo ""
