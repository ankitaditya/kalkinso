import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@carbon/styles/css/styles.css'; // Carbon styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
