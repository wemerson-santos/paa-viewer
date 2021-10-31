import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/nucleo.css';
import './assets/css/fontawesome-free/css/all.min.css';
import './assets/css/argon.css?v=1.2.0';
import './assets/custom/react-tabs.css';
import './assets/custom/app.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
