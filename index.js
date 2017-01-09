const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');

let app = express();

app.locals.assetUrl = (asset) => {
    if (process.env.NODE_ENV !== 'production') {
        return '//localhost:1337' + asset;
    } else {
        return '/dist' + asset;
    }
};

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/web'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/process', (req, res) => {
    let filename = req.body.filename || 'excel-links.xlsx';
    if (!filename) {
        res.status(400).send({
            error: 'Missing filename'
        });

        return;
    }

    if (!filename.match(/^[a-zA-Z0-9\_\-\.]+\.xlsx$/)) {
        res.status(400).send({
            error: 'Invalid filename'
        });

        return;
    }

    let imagePath = req.body.imagePath || 'images/';
    if (!imagePath) {
        res.status(400).send({
            error: 'Missing image path'
        });

        return;
    }

    imagePath = imagePath.replace('/', '');
    if (!imagePath.match(/^[a-zA-Z0-9\_\-\.]+$/)) {
        res.status(400).send({
            error: 'Invalid image path'
        });

        return;
    }

    let files = req.body.files;
    if (!files || files.length === 0) {
        res.status(400).send({
            error: 'No files were passed'
        });

        return;
    }

    let params = {
        filename: filename,
        imagePath: imagePath,
        files: files
    };

    const Excel = require('exceljs');
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Links');

    files.forEach((file, i) => {
        let row = worksheet.getRow(i + 1);
        let linkCell = row.getCell(1);
        let link = imagePath + '/' + file;

        linkCell.type  = Excel.ValueType.Hyperlink;
        linkCell.value = {
            text: file,
            hyperlink: link
        };

        linkCell.width = 50;

        linkCell.font = {
            color: { argb: 'FF0000FF' },
            underline: true
        };

        row.commit();
    });

    res.type('.xlsx');
    res.set({
        'Content-Disposition': 'attachment; filename="' + filename + '"'
    });

    // write to response stream
    workbook.xlsx.write(res)
        .then(() => {
            res.send();
        });
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
