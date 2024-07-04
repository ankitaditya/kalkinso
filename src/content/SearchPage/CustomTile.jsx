import React from 'react';
import { Column, Grid, Tile, Row, ClickableTile, Link } from '@carbon/react';
import './CustomTile.css'; // For hover effects and additional styling

const CustomTile = ({ title, description, imgSrc }) => (
  <Tile className="custom-tile" style={{ marginBottom: '1rem', padding: '1rem' }}>
    <Grid fullWidth>
    <Column sm={1} md={2} lg={1}>
        <img
          src={imgSrc}
          alt={`Avatar for ${title}`}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </Column>
      <Column sm={3} md={4} lg={7}>
        <Link href={imgSrc} style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          {title}
        </Link>
        <p style={{ color: '#0062ff', margin: '0.5rem 0' }}>{imgSrc}</p>
        <p>{description}</p>
      </Column>
    </Grid>
  </Tile>
);

export default CustomTile;