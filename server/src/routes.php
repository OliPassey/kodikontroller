<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Symfony\Component\Yaml\Yaml;
use \KodiKontroller\KodiKontrollerScreen;
use \KodiKontroller\KodiKontrollerCommand;


// ----- Tests -----

$app->get('/test', function (Request $request, Response $response, array $args) {
    $args['config'] = Yaml::parseFile(__DIR__ . '/../config.yml');
    $args['baseUrl'] = $this->request->getUri()->getBaseUrl();
    $data = $request->getParsedBody();

    $commandData = [
        "jsonrpc" => "2.0",
        "id" => "1",
        "method" => "GUI.ShowNotification",
        "params" => [
            "title" => "Notification",
            "message" => "Hi",
            "displaytime" => 10000,
        ]
    ];

    $targetData = [
        'host' => 'http://kodi:password@192.168.0.28:8081',
    ];

    $command = new KodiKontrollerCommand($targetData, $commandData);

    return $command->exec();
});



// ----- Main interface -----

$app->get('/main', function (Request $request, Response $response, array $args) {
    $args['config'] = Yaml::parseFile(__DIR__ . '/../config.yml');
    return $this->view->render($response, 'main.html.twig', $args);
});



// ----- AJAX Endpoints -----

$app->post('/send/{target}', function (Request $request, Response $response, array $args) {
    $args['config'] = Yaml::parseFile(__DIR__ . '/../config.yml');
    $data = $request->getParsedBody();
    return $response->withStatus(400);
});



// ----- Catch-all for unrouted POST requests -----
$app->post('/[{path:.*}]', function (Request $request, Response $response, array $args) {
    $this->logger->error("Bad POST request: " . $request->getUri()->getPath());
    return $response->withStatus(400);
});


// ----- Catch-all for GET requests -----
$app->get('/[{path:.*}]', function (Request $request, Response $response, array $args) {
    $this->logger->error("Unmatched route: " . $request->getUri()->getPath());

    // Render 404 page
    $args['baseUrl'] = $this->request->getUri()->getBaseUrl();
    return $this->view->render($response->withStatus(404), '404.html.twig', $args);
});
