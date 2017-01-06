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
    let files = req.body.files;
    if (!files || files.length === 0) {
        res.status(400).send('No files were passed');
    }

    let Excel = require('exceljs');

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Links');

    files.forEach(function(file, i) {
        let row = worksheet.getRow(i + 1);
        let nameCell = row.getCell(1);
        let linkCell = row.getCell(2);
        let link = 'Reduziert/' + file;

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

    let filename = 'fooblah.xlsx';

    res.type('.xlsx');
    res.set({
        'Content-Disposition': 'attachment; filename="' + filename + '"'
    });

    // write to a stream
    workbook.xlsx.write(res)
        .then(function() {
            res.send();
        });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
