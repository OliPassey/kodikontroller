<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require __DIR__ . '/vendor/autoload.php';

// Instantiate the app
$settings = require __DIR__ . '/src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/src/dependencies.php';

// Register middleware
require __DIR__ . '/src/middleware.php';

$kontroller = $app->getContainer()->get('kontroller');

// Hard-coded test command
$command = new \KodiKontroller\KodiKontrollerCommand('all', '{"jsonrpc":"2.0","id":"1","method":"GUI.ShowNotification","params":{"title":"Notification","message":"Hi","displaytime":20000}}', $kontroller);
$result = $command->exec();

echo(json_encode($result) . "\n");
