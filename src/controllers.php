<?php

use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

//Request::setTrustedProxies(array('127.0.0.1'));

/** @var \Silex\Application $app */
$app->get('/', function () use ($app) {
    return $app['twig']->render('index.html.twig', array());
})
->bind('homepage')
;

$app->post('/process', function (Request $request) use ($app) {
    $fileNames = $request->get('fileNames');
    if (!$fileNames) {
        return $app->json([
            'error' => 'No filenames found',
        ], 400);
    } else {
        $fileNames = explode(',', $fileNames);
    }

    /** @var \Symfony\Component\HttpFoundation\File\UploadedFile $excelFile */
    $excelFile = $request->files->get('excelFile');
    if (!$excelFile) {
        return $app->json([
            'error' => 'No excel file found',
        ], 400);
    }

    $uuid = Uuid::uuid4();
    $file = $excelFile->move($app['file_dir'], $uuid);

    return $app->json([
        'excelFile' => $file->getRealPath(),
        'fileNames' => $fileNames,
    ]);
})
->bind('process')
;

$app->error(function (\Exception $e, Request $request, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    // 404.html, or 40x.html, or 4xx.html, or error.html
    $templates = array(
        'errors/'.$code.'.html.twig',
        'errors/'.substr($code, 0, 2).'x.html.twig',
        'errors/'.substr($code, 0, 1).'xx.html.twig',
        'errors/default.html.twig',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});
