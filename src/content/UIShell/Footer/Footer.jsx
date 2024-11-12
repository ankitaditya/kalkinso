import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className='footer'>
      <center className='center'>
          <div className='links'>
            <a className='a-tag' href={`${window.location.origin}/#/privacy-policy`} style={{ color:"white",margin: '0 15px' }}>
              Privacy Policy
            </a>
            <a className='a-tag' href={`${window.location.origin}/#/terms-n-conditions`} style={{ color:"white", margin: '0 15px' }}>
              Terms & Conditions
            </a>
            <a className='a-tag' href={`${window.location.origin}/#/contact`} style={{ color:"white", margin: '0 15px' }}>
              Contact Us
            </a>
          </div>
        </center>
    </footer>
  );
};

export default Footer;
