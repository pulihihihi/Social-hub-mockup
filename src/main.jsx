/**
 * React Entry Point — ConfigProvider wraps entire app with antd theme
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { antdTheme } from './theme';
import App from './App';
import './hover-utils.css';
import './action-control-contract.css';

dayjs.locale('en');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme} locale={enUS}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
