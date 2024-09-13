import React from 'react';
import cx from 'classnames';

import './_GalleryCard.scss';

import { Button, ClickableTile, Column, Grid, Link } from '@carbon/react';
import { Chat, Share, UserAvatarFilledAlt } from '@carbon/react/icons';

const baseClass = 'gallery-card';

export const GalleryCard = ({ className, title, url, thumbnail, open }) => {
  return (
    <>
    <ClickableTile className={cx(className, baseClass)} onClick={()=>open()}>
      <div
        className={`${baseClass}__thumbnail`}
        style={{
          backgroundImage: thumbnail,
        }}
      />
      <Grid fullWidth>
          <Column sm={3} md={4} lg={16}>
            <Link href={url} style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {title}
            </Link>
            <p style={{ color: '#0062ff', margin: '0.5rem 0' }}>{url}</p>
            <p>{thumbnail}</p>
          </Column>
      </Grid>
    </ClickableTile>
    <Grid className={`${baseClass}__post-actions`}>
        <Column sm={1} md={1} lg={4}>
          <Button kind='ghost' renderIcon={Chat} size="small"></Button>
        </Column>
        <Column sm={1} md={1} lg={4}>
          <Button kind='ghost' renderIcon={Share} size="small"></Button>
        </Column>
        <Column sm={1} md={1} lg={4}>
          <Button kind='ghost' renderIcon={UserAvatarFilledAlt} size="small"></Button>
        </Column>
      </Grid>
    </>
  );
};