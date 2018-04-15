<?php
return [
    'settings' => [

        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Database settings (Doctrine)
        'doctrine' => [
            'meta' => [
                'entity_path' => [
                    'src/KodiKontroller/Entity'
                ],
                'auto_generate_proxies' => true,
                'proxy_dir' =>  __DIR__.'/../cache/proxies',
                'cache' => null,
            ],
            'connection' => [
                'driver'   => 'pdo_mysql',
                'host'     => 'mariadb',
                'dbname'   => 'kodikontroller',
                'user'     => 'kodikontroller',
                'password' => 'kodikontroller',
            ]
        ],

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
