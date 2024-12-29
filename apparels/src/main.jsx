import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@carbon/styles/css/styles.css'; // Carbon styles
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { CartProvider } from './pages/Cart/cart-context';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)
