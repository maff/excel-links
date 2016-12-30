<?php

namespace App\Controller;

use Ramsey\Uuid\Uuid;
use Silex\Application;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class AppController
{
    /** @var Application */
    protected $app;

    /**
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function indexAction()
    {
        return $this->app['twig']->render('index.html.twig', []);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function processAction(Request $request)
    {
        $fileNames = $request->get('fileNames');
        if (!$fileNames) {
            return $this->app->json([
                'error' => 'No filenames found',
            ], 400);
        } else {
            $fileNames = explode(',', $fileNames);
        }

        /** @var \Symfony\Component\HttpFoundation\File\UploadedFile $excelFile */
        $excelFile = $request->files->get('excelFile');
        if (!$excelFile) {
            return $this->app->json([
                'error' => 'No excel file found',
            ], 400);
        }

        $uuid = Uuid::uuid4();
        $file = $excelFile->move($this->app['file_dir'], $uuid);

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
        $savePath = $this->app['file_dir'] . '/' . $saveName;

        $writer = \PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $writer->save($savePath);

        return $this->app->json([
            'excelFile'   => $file->getRealPath(),
            'savePath'    => $savePath,
            'fileNames'   => $fileNames,
            'downloadUri' => '/download/' . $uuid
        ]);
    }

    /**
     * @param string $uuid
     * @return BinaryFileResponse
     */
    public function downloadAction($uuid)
    {
        $filename = $uuid . '_edited.xlsx';
        $file = $this->app['file_dir'] . '/' . $filename;

        if (!file_exists($file)) {
            $this->app->abort(404, 'File does not exist');
        }

        $response = new BinaryFileResponse(new \SplFileInfo($file));
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename,
            iconv('UTF-8', 'ASCII//TRANSLIT', $filename)
        );

        return $response;
    }
}
