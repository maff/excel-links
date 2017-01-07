import $ from 'jquery';
import Dropzone from 'dropzone';

import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap.css';

import 'dropzone/dist/basic.css';
import 'dropzone/dist/dropzone.css';

"use strict";

Dropzone.autoDiscover = false;

let $dropzoneContainer = $('.dropzone-container');
let $submitButton = $('#submitButton');
$submitButton.prop('disabled', true);

let files = [];
let downloaded = [];

let dropzone = new Dropzone("div#dropzone", {
    url: '/',
    uploadMultiple: true,
    autoProcessQueue: false,
    createImageThumbnails: false,
    acceptedFiles: 'image/*',

    init: function () {
        let dz = this;

        dz.on('addedfile', function (file) {
            files.push(file);

            if (files.length > 0) {
                $submitButton.prop('disabled', false);
            }
        });

        dz.on('sending', function (xhr, formData) {
            console.log('sending', formData, arguments);
        });
    }
});

let $downloadContainer = $('#download-container');
let $downloadList = $downloadContainer.find('ul');

function updateDownloaded() {
    $downloadList.find('li').remove();

    downloaded.forEach(function(file, i) {
        let $li = $('<li />')
            .appendTo($downloadList);

        let $link = $('<a />')
            .attr('href', '#')
            .text(file.name)
            .appendTo($li);

        $link.on('click', function (e) {
            e.preventDefault();
            FileSaver.saveAs(file.blob, file.name);
        });
    });
}

$submitButton.on('click', function (e) {
    e.preventDefault();

    let data = {
        files: []
    };

    files.forEach(function(file, i) {
        data.files.push(file.name);;
    });

    let $form = $('form#file-form');
    $form.serializeArray().forEach(function(item, i) {
        if (item.value) {
            data[item.name] = item.value;
        }
    });

    console.log('DATA', data);

    axios.post('/process', data, {
        responseType: 'blob'
    })
        .then(function (response) {
            console.log(response);
            downloaded.push({
                name: 'fooblah.xlsx',
                blob: response.data
            });

            updateDownloaded();
        })
        .catch(function (error) {
            console.log(error);
        });
});

updateDownloaded();
