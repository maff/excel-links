import $ from 'jquery';
import Dropzone from 'dropzone';
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
    if ($form.length > 1) {
        $form.remove();
    }

    $form = $('<form />');
    $form.attr('method', 'post');
    $form.attr('action', $(this).data('href'));
    $form.attr('id', 'file-form');

    // let fileNames = [];
    files.forEach(function(file, i) {
        let $input = $('<input type="hidden" />');
        $input.attr('name', 'files[]');
        $input.val(file.name);
        $input.appendTo($form);

        // fileNames.push(file.name);
    });

    $form.submit();

    return;

    let data = new FormData();
    data.append('files', fileNames);

    $.ajax({
        url: $(this).data('href'),
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
    }).then(function(result) {
        console.log('success', arguments);
        window.location.href = result.downloadURI;
    }).fail(function() {
        console.error('fail', arguments);
    }).always(function() {
        console.log('always', arguments);
    });
});
