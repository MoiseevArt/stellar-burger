import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/app/app';
import store from './services/store';

import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

const AppWithProviders = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
