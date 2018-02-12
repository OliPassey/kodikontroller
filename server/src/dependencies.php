<?php
// DIC configuration

$container = $app->getContainer();

// Twig
$container['view'] = function ($c) {
    $settings = $c->get('settings')['view'];
    $view = new \Slim\Views\Twig(
        $settings['template_path'],
        [
            'cache' => $settings['cache']
        ]
    );
    $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($c['router'], $basePath));
    return $view;
};

// Monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};


// KodiKontroller
$container['kontroller'] = function ($c) {
    $kontroller = new \KodiKontroller\KodiKontroller();
    return $kontroller;
};
