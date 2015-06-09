#!/bin/sh

jsdoc ../../../public-static/internal/src/* -d output/html
jsdoc2md ../../../public-static/internal/src/* >output/README.md
