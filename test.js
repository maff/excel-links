let Excel = require('exceljs');

let images = [
    'IMG_0001.jpg',
    'IMG_0002.jpg',
    'IMG_0003.jpg',
    'IMG_0004.jpg',
    'IMG_0005.jpg',
    'IMG_0006.jpg',
    'IMG_0007.jpg',
    'IMG_0008.jpg',
    'IMG_0009.jpg',
    'IMG_0010.jpg'
];

let workbook = new Excel.Workbook();
let worksheet = workbook.addWorksheet('Links');

images.forEach(function(image, i) {
    let row = worksheet.getRow(i + 1);
    let nameCell = row.getCell(1);
    let linkCell = row.getCell(2);
    let link = 'Reduziert/' + image;

    nameCell.value = image;

    linkCell.type  = Excel.ValueType.Hyperlink;
    linkCell.value = {
        text: link,
        hyperlink: link
    };

    linkCell.font = {
        color: { argb: 'FF0000FF' },
        underline: true
    };

    row.commit();
});

workbook.xlsx.writeFile('excel-node.xlsx')
    .then(function() {
        console.log('WRITTEN FILE');
    });
