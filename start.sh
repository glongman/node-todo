#!/bin/sh -e
# lets check if we have the submodules initialized
cd `dirname $0`
if [ ! -e vendor/connect/LICENSE ]; then
	echo "--------------------------- Please wait, initializing submodules for first launch ------------------------"
    git submodule update --init --recursive
	echo "--------------------------- Submodules installed ------------------------"
fi

node start.js