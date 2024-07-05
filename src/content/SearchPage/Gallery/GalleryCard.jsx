import React from 'react';
import cx from 'classnames';

import './_GalleryCard.scss';

import { ClickableTile } from '@carbon/react';

const baseClass = 'gallery-card';

export const GalleryCard = ({ className, title, url, thumbnail, open }) => {
  return (
    <ClickableTile className={cx(className, baseClass)} onClick={()=>open()}>
      <div
        className={`${baseClass}__thumbnail`}
        style={{
          backgroundImage: thumbnail,
        }}
      />
      <h1 className={`${baseClass}__title`}>{title}</h1>
    </ClickableTile>
  );
};