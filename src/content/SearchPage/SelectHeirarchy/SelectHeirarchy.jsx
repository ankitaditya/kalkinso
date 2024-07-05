import React, { useEffect, useState } from 'react';
import { MultiAddSelect } from '@carbon/ibm-products';
import { Document, Group } from '@carbon/react/icons';
import { pkg } from '@carbon/ibm-products/lib/settings';
import image from '../banner.png';

const blockClass = `${pkg.prefix}--add-select__meta-panel`; // cspell:disable-line

const items = {
    sortBy: ['title'],
    entries: [
      {
        id: '1',
        value: 'folder 1',
        title: 'folder 1',
        children: {
          sortBy: ['title', 'size'],
          filterBy: 'fileType',
          entries: [
            {
              id: '1-1',
              value: 'file1.pdf',
              title: 'file1.pdf',
              fileType: 'pdf',
              size: '100',
              icon: (props) => <Document size={16} {...props} />,
              tag: 'business',
              children: {
                entries: [
                  {
                    id: '9000',
                    value: '9000.html',
                    title: '9000.html',
                    fileType: 'html',
                    size: '9000',
                    icon: (props) => <Document size={16} {...props} />,
                  },
                ],
              },
            },
            {
              id: '1-2',
              value: 'index.js',
              title: 'index.js',
              fileType: 'js',
              size: '200',
              icon: (props) => <Document size={16} {...props} />,
            },
            {
              id: '1-3',
              value: 'sitemap.xml',
              title: 'sitemap.xml',
              fileType: 'xml',
              size: '10',
              icon: (props) => <Document size={16} {...props} />,
            },
          ],
        },
      },
      {
        id: '2',
        value: 'folder 2',
        title: 'folder 2',
        children: {
          entries: [
            {
              id: '7000',
              value: '7000.html',
              title: '7000.html',
              fileType: 'html',
              size: '7000',
              icon: (props) => <Document size={16} {...props} />,
            },
          ],
        },
      },
    ],
  };

const defaultProps = {
    items: items,
    className: 'placeholder-class',
    clearFiltersText: 'Clear filters',
    closeIconDescription: 'Close',
    columnInputPlaceholder: 'Find',
    description: 'Select business terms from the list',
    globalSearchLabel: 'global search label',
    globalSearchPlaceholder: 'Find business terms',
    illustrationTheme: 'light',
    influencerTitle: 'Selected business terms',
    itemsLabel: 'Business terms',
    metaIconDescription: 'View meta information',
    metaPanelTitle: 'Personal information',
    navIconDescription: 'View children',
    noResultsTitle: 'No results',
    noSelectionDescription:
      'Select a term to include the full set of the governance artifacts it contains in the governance scope.',
    noSelectionTitle: 'No business terms selected',
    noResultsDescription: 'Try again',
    onCloseButtonText: 'Cancel',
    onSubmit: (selections) => console.log(selections),
    onSubmitButtonText: 'Add',
    searchResultsTitle: 'Search results',
    title: 'Add business terms',
    sortByLabel: 'Sort',
    filterByLabel: 'Filter',
    // globalFilters: [
    //     {
    //       id: 'fileType',
    //       label: 'File type',
    //     },
    //     {
    //       id: 'size',
    //       label: 'Size',
    //     },
    //     {
    //       id: 'tag',
    //       label: 'Tag',
    //     },
    //   ],
    //   globalFiltersIconDescription: 'Filter',
    //   globalFiltersLabel: 'Filters',
    //   globalFiltersPlaceholderText: 'Choose an option',
    //   globalFiltersPrimaryButtonText: 'Apply',
    //   globalFiltersSecondaryButtonText: 'Reset',
    //   globalSortBy: ['title'],
  };


const Template = ({open, onClose}) => {
    const [ props, setProps ] = useState(defaultProps);

    return (
        <MultiAddSelect 
        {...props} 
        open={open} 
        onClose={onClose} 
        />
    );
  };

  export default Template;