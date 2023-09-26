#!/bin/sh

php ../tools/gen/gen-includes constants.php . core global node>constants.php

php ../tools/gen/gen-includes plugin.php . core>plugin.php

