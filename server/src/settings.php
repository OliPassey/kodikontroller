<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Twig settings
        'view' => [
            'template_path' => __DIR__ . '/../templates/',
            'cache' => false // __DIR__ . '/../cache'
        ],

        // Monolog settings
        'logger' => [
            'name' => 'kodikontroller',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
    ],
];
