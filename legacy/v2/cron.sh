#!/bin/sh

if [ $docker ]; then
  php ./cron.php;
elif [ `docker-compose ps -q | wc -l` -eq 1 ]; then
  docker-compose exec kodikontroller ./cron.sh;
else
  echo
  echo "-------------------------------------------------------------------------";
  echo " WARNING: Trying to run 'php cron.php' natively in the local shell. This";
  echo " is a fallback mode, only attempted if no docker environment appears to";
  echo " be available."
  echo
  echo " If you're seeing this message in your logs you should adjust your";
  echo " KodiKontroller cron task. (In a production environment it's likely";
  echo " you'll want to call 'php cron.php' directly.)"
  echo
  echo " Have you tried running 'docker-compose up -d'?"
  echo "-------------------------------------------------------------------------";
  echo
  php ./cron.php;
fi

