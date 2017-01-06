var express = require('express');
var app = express();

const util = require('util');
const bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/web'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post('/process', function(req, res) {
    let filename = req.body.filename;
    if (!filename) {
        res.status(400).send('Missing filename');
    }

    if (!filename.match(/^[a-zA-Z0-9\_\-\.]+\.xlsx$/)) {
        res.status(400).send('Invalid filename');
    }

    let imagePath = req.body.imagePath;
    if (!imagePath) {
        res.status(400).send('Missing image path');
    }

    imagePath = imagePath.replace('/', '');
    if (!imagePath.match(/^[a-zA-Z0-9\_\-\.]+$/)) {
        res.status(400).send('Invalid image path');
    }

    let files = req.body.files;
    if (!files || files.length === 0) {
        res.status(400).send('No files were passed');
    }

    let params = {
        filename: filename,
        imagePath: imagePath,
        files: files
    };

    console.log('/process params', params);

    let Excel = require('exceljs');

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Links');

    files.forEach(function(file, i) {
        let row = worksheet.getRow(i + 1);
        let nameCell = row.getCell(1);
        let linkCell = row.getCell(2);
        let link = imagePath + '/' + file;

        nameCell.value = file;

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

    res.type('.xlsx');
    res.set({
        'Content-Disposition': 'attachment; filename="' + filename + '"'
    });

    // write to response stream
    workbook.xlsx.write(res)
        .then(function() {
            console.log('Written to response stream');
            res.send();
        });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
