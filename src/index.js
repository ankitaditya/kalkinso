import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-ultimate';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import '@carbon/charts/styles.css';
import '@carbon/charts-react/styles.css';

// Create a QueryClient
const queryClient = new QueryClient();

// Hydrate the QueryClient with the server's state
const dehydratedState = window.__REACT_QUERY_STATE__;

const root = ReactDOM.hydrateRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
                <GoogleReCaptchaProvider
                    type="v3"
                    siteKey="6LceW3sqAAAAAPrfgykEvRFKkeBmEv73ZKL8Ww6V"
                >
                    <App />
                </GoogleReCaptchaProvider>
            </Hydrate>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
