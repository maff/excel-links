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

$submitButton.on('click', function (e) {
    e.preventDefault();

    let $form = $('form#file-form');

    // remove previously set file inputs
    $form
        .find('input[type="hidden"][name="files"]')
        .remove();

    files.forEach(function(file, i) {
        let $input = $('<input />');
        $input.attr('type', 'hidden');
        $input.attr('name', 'files');
        $input.val(file.name);
        $input.appendTo($form);
    });

    $form.submit();
});
