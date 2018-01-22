<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Symfony\Component\Yaml\Yaml;

// Routes


// Catch-all POST
$app->post('/[{path:.*}]', function (Request $request, Response $response, array $args) {
    $this->logger->error("Bad request: " . $request->getUri()->getPath());
    return $response->withStatus(400);
});


// Catch-all GET
$app->get('/[{path:.*}]', function (Request $request, Response $response, array $args) {
    $this->logger->error("Unmatched route: " . $request->getUri()->getPath());

    // Render about page
    $args['config'] = Yaml::parseFile(__DIR__ . '/../config.yml');
    return $this->view->render($response, 'about.html.twig', $args);
});
