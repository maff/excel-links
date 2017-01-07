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

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
