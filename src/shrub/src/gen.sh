#!/bin/sh

php ../tools/gen_includes constants.php . core global node>constants.php

php ../tools/gen_includes plugin.php . core>plugin.php

