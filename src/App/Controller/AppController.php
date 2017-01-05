<?php

namespace App\Controller;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
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
     * @return Response
     */
    public function processAction(Request $request)
    {
        $files = $request->get('files', []);
        if (!$files) {
            return $this->app->json([
                'error' => 'No filenames found',
            ], 400);
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        for ($i = 0; $i < count($files); $i++) {
            $fileName = $files[$i];
            $filePath = 'Reduziert/' . $fileName;

            $nameCell = 'A' . $i;
            $linkCell = 'B' . $i;

            $sheet->setCellValue($nameCell, $fileName);
            $sheet->setCellValue($linkCell, $filePath);

            $sheet->getCell($linkCell)
                ->setValue($filePath)
                ->getStyle()
                    ->applyFromArray($this->linkStyle);

            $sheet->getCell($linkCell)->getHyperlink()->setUrl('http://www.phpexcel.net');
            // $worksheet->getCell($linkCell)->getHyperlink()->setUrl($filePath);
            // $worksheet->getCell($linkCell)->getHyperlink()->setTooltip($fileName);
        }

        /** @var Uuid $uuid */
        $uuid = Uuid::uuid4();

        $fileName = $uuid . '.xlsx';
        $writer   = IOFactory::createWriter($spreadsheet, 'Excel2007');

        ob_start();
        $writer->save('php://output');

        $response = new Response(ob_get_clean());
        $response->setPublic();

        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $fileName);

        $response->headers->add([
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet',
            'Content-Disposition' => $disposition,
            'Pragma'              => 'no-cache',
            'Expired'             => 0,
        ]);

        return $response;
    }

    public function analyzeAction()
    {
        $file = $this->app['file_dir'] . '/test.xlsx';

        $excel = IOFactory::load($file);
        $sheet = $excel->getActiveSheet();

        $cell = $sheet->getCell('B1');
        dump($cell);

        $link = $cell->getHyperlink();
        dump($link);

        return new Response('');
    }
}
