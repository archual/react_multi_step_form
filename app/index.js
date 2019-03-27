'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

jQuery(document).ready(function () {
    ReactDOM.render(
      <App/>,
      document.getElementById('react-form')
    );
});

