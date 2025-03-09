import React from 'react';
import { Grid, Column } from '@carbon/react';
import './HeroSection.scss';
import logo from '../SearchPage/banner.png';

const HeroSection = ({ ButtonComponent }) => {
  return (
    <div className="hero-section">
      <Grid>
        <Column lg={8} md={4} sm={4} className="hero-text">
          <h1>
            Building Your <span className="highlight">Vision</span>
          </h1>
          <h1 className="hero-heading">
            The <span className="highlight">Blueprint</span> of Your <span className="highlight">Imagination</span>
          </h1>
          <p className="hero-description">
            At Kalkinso, every achievement begins with an idea. We turn imagination into reality, one detail at a time.
          </p>
          {ButtonComponent}
        </Column>
        <Column lg={8} md={4} sm={4} className="hero-image-container">
          <img src={logo} alt="KALKINSO Hero" className="hero-image" />
        </Column>
      </Grid>
    </div>
  );
};

export default HeroSection;
