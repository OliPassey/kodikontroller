<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Symfony\Component\Yaml\Yaml;
use KodiKontroller\KodiKontrollerScreen;
use KodiKontroller\KodiKontrollerCommand;


// ----- Tests -----

$app->get('/test', function (Request $request, Response $response, array $args) {
    $k = $this->get('kontroller');
    return '[' . $k->getTargetType('pud') . ']<br>';
});



// ----- Main interface -----

$app->get('/main', function (Request $request, Response $response, array $args) {
    $k = $this->get('kontroller');
    $args['screens'] = $k->getScreens();
    $args['groups'] = $k->getGroups();
    return $this->view->render($response, 'main.html.twig', $args);
});



// ----- AJAX Endpoints -----

$app->post('/send/{target}', function (Request $request, Response $response, array $args) {

    $target = $args['target'];
    $requestData = $request->getParsedBody()['request'];
    $kontroller = $this->get('kontroller');

    $command = new KodiKontrollerCommand($target, $requestData, $kontroller);
    $data = $command->exec();

    $status = (isset($data->result) && $data->result == 'OK') ? 200 : 500;
    $response = $response->withJson($data);;

    return $response->withStatus($status);

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
