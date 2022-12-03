#!/bin/sh

# Run composer
./composer install
./composer dump-autoload

# Set up a simple PHP server
php -S 0.0.0.0:8080 -t public

