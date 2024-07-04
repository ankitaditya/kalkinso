import React from 'react';
import { Grid, Column, Tile, Row } from '@carbon/react';

const Banner = ({ logoSrc, altText }) => {
  return (
    <img
    src={logoSrc}
    alt={altText}
    style={{
      height: '35vh',
      objectFit: 'contain',
      marginBottom: '1rem'
    }}
  />
  );
};

export default Banner;