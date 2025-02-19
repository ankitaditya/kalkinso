import React from 'react';
import { Button, Grid, Row, Column } from '@carbon/react';
import './HeroSection.scss';
import logo from '../SearchPage/banner.png';
import TypewriterEffect from './TypewritterEffect';

const HeroSection = ({ButtonComponent}) => {
  return (
    <div className="hero-section">
      <Grid>
          <Column lg={10} md={6} sm={4}>
          <h1>Empower Your Vision with Kalkinso</h1>
          <p>
              Discover new opportunities by taking on tasks and earning rewards. 
              Small businesses can tap into a diverse pool of skilled contributors to find innovative solutions and drive growth.
          </p>
            {/* <p style={{
                      display: 'inline-block',
                      fontSize: '1.2rem',
                      backgroundColor: '#FFF',
                      padding: '15px 30px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <strong>E</strong>ffortless <strong>I</strong>ntegration, <strong>D</strong>ynamic <strong>T</strong>asking, <strong>S</strong>calable <strong>G</strong>rowth
              </p> */}
            {ButtonComponent}
          </Column>
          <Column lg={6} md={2} sm={4}>
            {/* <img src={logo} alt="KALKINSO Hero Image" className="hero-image" /> */}
            <iframe width="100vw" height="315" src="https://www.youtube-nocookie.com/embed/rQRM1mGaaqE?si=cCU99Ks_Ll0CwUu1&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </Column>
      </Grid>
    </div>
  );
};

export default HeroSection;