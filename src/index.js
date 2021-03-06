import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppContextProvider from './Context/AppContext';
import ViewportContextProvider from './Context/ViewportContext';

ReactDOM.render(
    <React.StrictMode>
        <ViewportContextProvider>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </ViewportContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
