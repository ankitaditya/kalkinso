import React from 'react';
import { ProductiveCard, pkg } from '@carbon/ibm-products';
pkg.component.ProductiveCard = true;

const PreferenceCard = ({ title, description, onClick }) => {
  return (
    <ProductiveCard
      title={title}
      description={description}
      onClick={onClick}
      primaryButtonPlacement='bottom'
      primaryButtonText='Select'
      actionIcons={[
        {
          id: 1,
          icon: 'edit',
          onClick: () => console.log('Edit'),
        },
        {
          id: 2,
          icon: 'delete',
          onClick: () => console.log('Delete'),
        },
      ]}
    />
  );
};

export default PreferenceCard;
