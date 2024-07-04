import React from 'react';
import { Button, Grid, Row, Column } from '@carbon/react';
import './HeroSection.scss';
import logo from '../SearchPage/banner.png';

const HeroSection = ({ButtonComponent}) => {
  return (
    <div className="hero-section">
      <Grid>
          <Column lg={10} md={6} sm={4}>
            <h1>Empower Your Potential with Kalkinso.</h1>
            <p>Unlock opportunities by finding tasks and earning rewards. 
                Small businesses access top talent for innovative solutions from a vast contributor pool.</p>
            {ButtonComponent}
          </Column>
          <Column lg={4} md={2} sm={2}>
            <img src={logo} alt="Hero Image" className="hero-image" />
          </Column>
      </Grid>
    </div>
  );
};

export default HeroSection;