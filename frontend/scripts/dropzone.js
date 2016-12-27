import $ from 'jquery';
import Dropzone from 'dropzone';
import 'dropzone/dist/basic.css';
import 'dropzone/dist/dropzone.css';

"use strict";

Dropzone.autoDiscover = false;

let $submitButton = $('#submitButton');
$submitButton.prop('disabled', true);

let files = [];
let excelFile = null;

function isExcelFile(file) {
    return file.name.match(/\.xlsx$/);
}

let dropzone = new Dropzone("div#dropzone", {
    url: '/',
    uploadMultiple: true,
    autoProcessQueue: false,

    init: function () {
        let dz = this;

        dz.on('addedfile', function (file) {
            console.log('addedfile', file);

            if (isExcelFile(file)) {
                excelFile = file;
                console.log('got excel file', file);
            } else {
                files.push(file);
            }

            if (excelFile && files.length > 0) {
                $submitButton.prop('disabled', false);
            }
        });

        dz.on('sending', function (xhr, formData) {
            console.log('sending', formData, arguments);
        });
    },

    accept: function (file, done) {
        console.log('FILE', file);

        if (isExcelFile(file)) {
            if (excelFile) {
                done('Excel file is already set');
            } else {
                done();
            }
        } else {
            done();
        }
    }
});

$submitButton.on('click', function (e) {
    e.preventDefault();

    let fileNames = [];
    files.forEach(function(file, i) {
        fileNames.push(file.name);
    });

    let data = new FormData();
    data.append('excelFile', excelFile);
    data.append('fileNames', fileNames);

    $.ajax({
        url: '/process',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
    }).then(function() {
        console.log('success', arguments);
    }).fail(function() {
        console.log('fail', arguments);
    }).always(function() {
        console.log('always', arguments);
    });
});
