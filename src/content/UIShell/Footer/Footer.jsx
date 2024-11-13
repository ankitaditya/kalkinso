import React, { useState } from 'react';
import './Footer.scss';
import ChatScreen from '../SidePanelChat/ChatScreen/ChatScreen';
import { Button,IconButton } from '@carbon/react';
import { Close, OpenPanelBottom } from '@carbon/react/icons';
import { useSelector } from 'react-redux';

const Footer = () => {
  const [hoverContent, setHoverContent] = useState(null);
  const [ footerHover, setFooterHover ] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [chatState, setChatState] = useState(null);
  return (
    <footer 
      className='footer'   
      onMouseEnter={() => token&&setFooterHover(<Button className='a-tags open-icon-button' type='button' kind='primary' align='top' onClick={()=>setHoverContent(<><div className='close-icon-button'>
                                                  <IconButton type='button' kind='primary' label="Close" align='top' onClick={()=>setHoverContent(null)}>
                                                    <Close />
                                                  </IconButton>
                                                  </div>
                                                  <div className='footer-onhover'>
                                                    <ChatScreen state={{chatState, setChatState}}  />
                                                  </div></>)}>
                                          <OpenPanelBottom /> <pre>{"  ChatAI"}</pre>
                                          </Button>)}
      onMouseLeave={() => token&&setFooterHover(null)}
    >
          {hoverContent}
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
            {!hoverContent&&footerHover}
          </div>
        </center>
    </footer>
  );
};

export default Footer;
