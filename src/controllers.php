<?php

use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

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

    $excel = \PHPExcel_IOFactory::load($file->getRealPath());
    $sheet = $excel->createSheet();

    // file:///L:/Erlerstrasse 1/__Abgabe/Reduziert/Erle_1_0367.jpg
    $fullPath = 'L:\\Erlerstrasse';
    $fullPath = str_replace('\\', '/', $fullPath);
    $fullPath = trim($fullPath);
    $fullPath = trim($fullPath, '/');

    for ($i = 0; $i < count($fileNames); $i++) {
        $filePath = $fullPath . '/' . $fileNames[$i];
        $fileUri  = 'file:///' . $filePath;

        $sheet->setCellValue('A' . $i, $fileNames[$i]);

        $linkCell = 'B' . $i;

        $sheet->setCellValue($linkCell, $filePath);
        $sheet->getCell($linkCell)->getHyperlink()->setUrl($fileUri);
    }

    $saveName = $uuid . '_edited.xlsx';
    $savePath = $app['file_dir'] . '/' . $saveName;

    $writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
    $writer->save($savePath);

    return $app->json([
        'excelFile'   => $file->getRealPath(),
        'savePath'    => $savePath,
        'fileNames'   => $fileNames,
        'downloadUri' => '/download/' . $uuid
    ]);
})
->bind('process')
;

$app->get('/download/{uuid}.xlsx', function($uuid) use ($app) {
    $filename = $uuid . '_edited.xlsx';
    $file = $app['file_dir'] . '/' . $filename;

    if (!file_exists($file)) {
        $app->abort(404, 'File does not exist');
    }

    $response = new BinaryFileResponse(new SplFileInfo($file));
    $response->setContentDisposition(
        ResponseHeaderBag::DISPOSITION_ATTACHMENT,
        $filename,
        iconv('UTF-8', 'ASCII//TRANSLIT', $filename)
    );

    return $response;
})
->bind('download')
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
