import React, { useState, useEffect } from 'react';

import { GalleryCard } from './GalleryCard';
import SelectHeirarchy from '../SelectHeirarchy/SelectHeirarchy';
import { Button, Checkbox, Popover, PopoverContent, RadioButton, RadioButtonGroup, Search } from '@carbon/react';
import config from '../gallery-config';
import logo from '../banner.webp';

import './_Gallery.scss';
import Banner from '../Banner';
import { useNavigate } from 'react-router-dom';
import { SearchBar, pkg } from '@carbon/ibm-products';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenTask } from '../../../actions/task';
import { ClickableTile } from 'carbon-components-react';

const blockClass = `gallery`;
pkg.component.SearchBar = true;

const packagePath =
  'github/carbon-design-system/ibm-products/tree/main/examples/carbon-for-ibm-products';

export const Gallery = ({ site, handleSearch }) => {
  const [filteredConfig, setFilteredConfig] = useState([]);
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const { openTask, isMulti } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLink = (dir) => {
    switch (site) {
      case 'stackblitz':
        return `https://stackblitz.com/${packagePath}/${dir}?file=src%2FExample%2FExample.jsx`;
      default:
        // codesandbox
        return `https://codesandbox.io/p/sandbox/${packagePath}/${dir}?file=%2Fsrc%2FExample%2FExample.jsx`;
    }
  };

  useEffect(() => {
    config.forEach((item) => {
      item.url = getLink(item.directory, site);
    });
    setFilteredConfig(config);
  }, [config, site]);

  return (
    <>
    {/* <div className={blockClass}> */}
      {/* <div className={`${blockClass}__container`}> */}
        {/* <h1 className={`${blockClass}__title`}>
          <Banner logoSrc={logo}/>
        </h1> */}
        <SearchBar
          className={`${blockClass}__filter`}
          autoComplete="search"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              let event = {
                value: e.target.value
              }
              handleSearch(event);
            }
          }}
          // onChange={(e) => setSearch(e.value)}
          onSubmit={(e)=>{
            let event = {
              value: e.value
            }
            handleSearch(event);
          }}
          // scopes={["All", "Components", "Patterns", "Guidelines", "Resources", "Utilities"].map((scope) => { return { id: scope, text: scope }; })} // NOTE: This is a workaround for the SearchBar component not accepting an array of strings
          titleText='Search'
          // hideScopesLabel={false}
          // scopesTypeLabel='Scopes'
          // scopeToString={(scope) => { return scope.text; }}
          submitLabel='Search'
          placeholderText='Search for a task...'
          labelText='Search'
          clearButtonLabelText='clear'
        />
        {/* <div className={`${blockClass}__gallery`}>
          {filteredConfig.map((item, index) => (
            <GalleryCard
              className={`${blockClass}__gallery-item`}
              key={index}
              title={item.label}
              url={item.url}
              open={()=>setOpen(true)}
              target="_blank" // NOTE: _top and _parent do not seem to work in codesandbox
              thumbnail={item.thumbnail}
            />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              className={`${blockClass}__gallery-item--dummy`}
              key={`dummy--${index}`}
              aria-hidden="true"
            />
          ))}
        </div> */}
      {/* </div> */}
    {/* </div> */}
    </>
  );
};

export default Gallery;