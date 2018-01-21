<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Symfony\Component\Yaml\Yaml;

// Routes






// Catch-all
$app->get('/[{path}]', function (Request $request, Response $response, array $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render default view
    return $this->renderer->render($response, 'index.phtml', $args);
});
