import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <section className="trending-mudda-section">
    <footer 
      className='footer'   
    >
        <center className='center'>
          <div className='links'>
            <a className='a-tag' href={`https://www.kalkinso.com/#/privacy-policy`} style={{ color:"white",margin: '0 15px', textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a className='a-tag' href={`https://www.kalkinso.com/#/terms-n-conditions`} style={{ color:"white", margin: '0 15px', textDecoration: "none" }}>
              Terms & Conditions
            </a>
            <a className='a-tag' href={`https://www.kalkinso.com/#/contact`} style={{ color:"white", margin: '0 15px', textDecoration: "none" }}>
              Contact Us
            </a>
          </div>
        </center>
    </footer>
    </section>
  );
};

export default Footer;
