<?php

namespace App\Controller;

use Ramsey\Uuid\Uuid;
use Silex\Application;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class AppController
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $linkStyle = [
        'font' => [
            'color' => [
                'rgb' => '0000FF',
            ],
            'underline' => 'single',
        ]
    ];

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
        $files = $request->get('files');
        if (!$files) {
            return $this->app->json([
                'error' => 'No filenames found',
            ], 400);
        } else {
            $files = explode(',', $files);
        }

        $excel = new \PHPExcel();
        $sheet = $excel->getActiveSheet();

        for ($i = 0; $i < count($files); $i++) {
            $fileName = $files[$i];
            $filePath = 'Reduziert/' . $fileName;

            $nameCell = 'A' . $i;
            $linkCell = 'B' . $i;

            $sheet->setCellValue($nameCell, $fileName);
            $sheet->setCellValue($linkCell, $filePath);

            $sheet->getCell($linkCell)
                ->setValue($filePath)
                ->setDataType(\PHPExcel_Cell_DataType::TYPE_STRING2)
                ->getStyle()
                    ->applyFromArray($this->linkStyle);

            $sheet->getCell($linkCell)->getHyperlink()->setUrl($filePath);
            $sheet->getCell($linkCell)->getHyperlink()->setTooltip($fileName);
        }

        /** @var Uuid $uuid */
        $uuid = Uuid::uuid4();

        $saveName = $uuid . '.xlsx';
        $savePath = $this->app['file_dir'] . '/' . $saveName;

        $writer = \PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $writer->save($savePath);

        return $this->app->json([
            'files'       => $files,
            'downloadURI' => $this->app['url_generator']->generate('download', ['uuid' => $uuid->toString()]),
        ]);
    }

    /**
     * @param string $uuid
     * @return BinaryFileResponse
     */
    public function downloadAction($uuid)
    {
        $filename = $uuid . '.xlsx';
        $file     = $this->app['file_dir'] . '/' . $filename;

        if (!file_exists($file)) {
            $this->app->abort(404, 'File does not exist');
        }

        $response = new BinaryFileResponse(new \SplFileInfo($file));
        // $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename
        );

        return $response;
    }

    public function analyzeAction()
    {
        $file = $this->app['file_dir'] . '/test.xlsx';

        $excel = \PHPExcel_IOFactory::load($file);
        $sheet = $excel->getActiveSheet();

        $cell = $sheet->getCell('B1');
        dump($cell);

        $link = $cell->getHyperlink();
        dump($link);

        return new Response('');
    }
}
