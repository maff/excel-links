import $ from 'jquery';
import Dropzone from 'dropzone';
import 'dropzone/dist/basic.css';
import 'dropzone/dist/dropzone.css';

"use strict";

let $dropzone = $('#dropzone');
let $submitButton = $('#submitButton');

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
            }
        });

        dz.on('sending', function (xhr, formData) {
            console.log('sending', formData, arguments);
        });

        $submitButton.on('click', function (e) {
            e.preventDefault();
            dz.processQueue();
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
