'use strict';

if (module.hot) {
    module.hot.accept();
}

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// import './dropzone';

import '../styles/index.scss';
import 'bootstrap/scss/bootstrap.scss';

let foo = 'bar';

ReactDOM.render(
    <div className="container">
        <h1>Hello, world! {foo}</h1>
    </div>,
    document.getElementById('app')
);
