'use strict';

if (module.hot) {
    module.hot.accept();
}

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import FileDropzone from './components/FileDropzone';
import DataForm from './components/DataForm';

// import './dropzone';

import '../styles/index.scss';
import 'bootstrap/scss/bootstrap.scss';

ReactDOM.render(
    <div className="container">
        <div className="row">
            <div className="col-5">
                Data

                <DataForm/>
            </div>
            <div className="col-5">
                Files

                <FileDropzone/>
            </div>
            <div className="col-2">
                Results
            </div>
        </div>
    </div>,
    document.getElementById('app')
);
