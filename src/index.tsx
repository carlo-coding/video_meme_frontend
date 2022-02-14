import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './views/App';
import reportWebVitals from './chest/reportWebVitals';
import { Provider } from "react-redux";
import { configureStore } from "./logic/store";
import services from './services';

window.process = {
  env: {},
  nextTick: ()=>{}
} as any

ReactDOM.render(
  <Provider store={configureStore(services)}>  
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
