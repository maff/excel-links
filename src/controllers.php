<?php

use App\Controller\AppController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

//Request::setTrustedProxies(array('127.0.0.1'));

/** @var \Silex\Application $app */
$app['app.controller'] = function () use ($app) {
    return new AppController($app);
};

function action($action, $controller = 'app')
{
    return sprintf('%s.controller:%sAction', $controller, $action);
}

$app
    ->get('/', action('index'))
    ->bind('homepage');

$app
    ->post('/process', action('process'))
    ->bind('process');

$app
    ->get('/download/{uuid}.xlsx', action('download'))
    ->bind('download');

$app->error(function (\Exception $e, Request $request, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    // 404.html, or 40x.html, or 4xx.html, or error.html
    $templates = [
        'errors/' . $code . '.html.twig',
        'errors/' . substr($code, 0, 2) . 'x.html.twig',
        'errors/' . substr($code, 0, 1) . 'xx.html.twig',
        'errors/default.html.twig',
    ];

    $result = $app['twig']
        ->resolveTemplate($templates)
        ->render(['code' => $code]);

    return new Response($result, $code);
});
