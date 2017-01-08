'use strict';

if (module.hot) {
    module.hot.accept();
}

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import '../styles/index.scss';
import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/scss/font-awesome.scss';

import 'nprogress/nprogress.css';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
