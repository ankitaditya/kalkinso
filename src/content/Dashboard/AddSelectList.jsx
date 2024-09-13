//
// Copyright IBM Corp. 2022, 2022
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { pkg } from '@carbon/ibm-products';
import { AddSelectRow } from './AddSelectRow';
import useFocus from '@carbon/ibm-products/lib/components/AddSelect/hooks/useFocus';
import { ContextMenu } from 'primereact/contextmenu';
import { Add, Copy, Document, Edit, Folder } from '@carbon/react/icons';


const blockClass = `${pkg.prefix}--add-select__selections`;
const componentName = 'AddSelectList';

export let AddSelectList = ({ filteredItems, multi, itemToDelete, setItemToDelete, cm, ...rest }) => {
  const [focus, setFocus] = useFocus(filteredItems.length);
  return (
    <div
      id="add-select-focus"
      className={cx(`${blockClass}-wrapper`, {
        [`${blockClass}-wrapper-multi`]: multi,
      })}
    >
      <div className={`${blockClass}`}>
        <div
          className={`${blockClass}-body`}
          role="treegrid"
          aria-label="add select tree label"
        >
          {filteredItems.map((item, index) => (
            <AddSelectRow
              key={item.id}
              index={index}
              focus={focus}
              itemToDelete={itemToDelete}
              setItemToDelete={setItemToDelete}
              cm={cm}
              setSize={filteredItems.length}
              item={item}
              multi={true}
              setFocus={setFocus}
              {...rest}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

AddSelectList.propTypes = {
  filteredItems: PropTypes.array,
  focus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multi: PropTypes.bool,
};

AddSelectList.displayName = componentName;
