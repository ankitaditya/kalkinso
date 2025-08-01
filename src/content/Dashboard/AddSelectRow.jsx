//
// Copyright IBM Corp. 2022, 2022
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useRef, useEffect, useCallback } from 'react';
import { Button, Dropdown, Layer } from '@carbon/react';
import { ChevronRight, View } from '@carbon/react/icons';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { pkg } from '@carbon/ibm-products';
import { AddSelectFormControl } from './AddSelectFormControl';
import { ContextMenu } from 'primereact/contextmenu';
import { useDispatch, useSelector } from 'react-redux';
import { setDeleteFile } from '../../actions/task';

const blockClass = `${pkg.prefix}--add-select__selections`;
const componentName = 'AddSelectList';

export let AddSelectRow = ({
  appliedModifiers,
  displayMetalPanel,
  index,
  focus,
  item,
  metaIconDescription,
  modifiers,
  multi,
  multiSelection,
  navIconDescription,
  itemToDelete,
  setItemToDelete,
  cm,
  parentId,
  parentSelected,
  setAppliedModifiers,
  setDisplayMetaPanel,
  setFocus,
  setMultiSelection,
  setParentSelected,
  setSingleSelection,
  setSize,
  singleSelection,
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (focus === index) {
      ref.current.focus();
    }
  }, [focus, index]);

  const isSelected = () => {
    if (multi) {
      return multiSelection.includes(item.id);
    }
    return item.id === singleSelection;
  };

  const getTabIndex = () => {
    // on initial load make the first item tabbable
    if (index === 0 && focus === '') {
      return 0;
    }

    // make it so only the last focused item is tabbable
    if (focus === index && focus !== '') {
      return 0;
    }

    // make unfocused items un-tabbable
    return -1;
  };

  const focusHandler = useCallback(
    (reset) => {
      setFocus(reset ? '' : index);
    },
    [setFocus, index]
  );

  const handleSingleSelection = () => {
    setSingleSelection(item.id);
  };

  const onSelectKeyDown = ({ key }) => {
    if (key === 'Enter' || key === ' ') {
      if (multi) {
        handleMultiSelection();
      } else {
        handleSingleSelection();
      }
    } else if (key === 'ArrowRight' && item.children) {
      onNavigateItem();
    }
  };

  const handleMultiSelection = () => {
    const checked = isSelected();
    if (!checked) {
      const newValues = [...multiSelection, item.id];
      setMultiSelection(newValues);
    } else {
      const newValues = multiSelection.filter((v) => v !== item.id);
      setMultiSelection(newValues);
    }
  };

  const onNavigateItem = () => {
    focusHandler(true);
    setParentSelected(item.id, item.title, parentId, item);
  };

  const modifierHandler = (id, selectedItem) => {
    const modifiersClone = [...appliedModifiers];
    const modifierIdx = modifiersClone.findIndex((item) => item.id === id);
    modifiersClone[modifierIdx] = {
      id,
      [modifiers.id]: selectedItem,
    };
    setAppliedModifiers(modifiersClone);
  };

  const metaPanelHandler = () => {
    if (item.meta) {
      setDisplayMetaPanel(item);
    }
  };

  const isInMetaPanel = (id) => id === displayMetalPanel?.id;
  const hasModifiers = modifiers?.options?.length > 0;
  const tabIndex = getTabIndex();
  const selected = isSelected();
  const expanded = parentSelected === item.id;
  return (
    <div
      className={cx(`${blockClass}-row`, {
        [`${blockClass}-row--selected`]: isSelected(),
        [`${blockClass}-row-meta--selected`]: isInMetaPanel(item.id),
        [`${blockClass}-row--active`]: expanded,
      })}
      onKeyDown={onSelectKeyDown}
      tabIndex={tabIndex}
      ref={ref}
      role="row"
      aria-selected={selected}
      aria-posinset={index + 1} // a11y aria-posinset must be >= 1, index is zero based
      aria-setsize={setSize}
      aria-expanded={expanded}
      onContextMenu={(e) => {
        setItemToDelete(item.id);
        // console.log('context Item: ', item);
        dispatch(setDeleteFile(item))
        cm.current.show(e);
      }}
    >
      <div className={`${blockClass}-cell`} role="gridcell">
        <div className={`${blockClass}-cell-wrapper`}>
          {multi ? (
            <>
              <AddSelectFormControl
                type="checkbox"
                item={item}
                selected={selected}
                onClick={handleMultiSelection}
              />
              {hasModifiers && (
                <Layer>
                  <Dropdown
                    titleText={modifiers.label}
                    id={`add-select-modifier-${item.id}`}
                    type="inline"
                    items={modifiers.options}
                    label={modifiers.label}
                    disabled={!isSelected()}
                    className={`${blockClass}-dropdown`}
                    initialSelectedItem={item[modifiers.id]}
                    onChange={({ selectedItem }) =>
                      modifierHandler(item.id, selectedItem)
                    }
                  />
                </Layer>
              )}
            </>
          ) : (
            <AddSelectFormControl
              type="radio"
              item={item}
              selected={selected}
              onClick={handleSingleSelection}
            />
          )}
          {item.children && (
            // <Button
            //   className={`${blockClass}-view-children`}
            //   renderIcon={(props) => }
            // //   iconDescription={navIconDescription}
            //   tooltipPosition="left"
            //   tooltipAlignment="center"
            //   title=""
            //   hasIconOnly
            //   onClick={onNavigateItem}
            //   kind="ghost"
            //   size="sm"
            //   tabIndex={-1}
            //   aria-hidden={true}
            // />
            <ChevronRight style={{
              cursor:"pointer"
            }} tabIndex={-1} className={`${blockClass}-view-children`} size={16} onClick={onNavigateItem}  />
          )}
          {item.meta && (
            <Button
              className={`${blockClass}-view-meta`}
              renderIcon={(props) => <View size={16} {...props} />}
              iconDescription={metaIconDescription}
              tooltipPosition="left"
              tooltipAlignment="center"
              hasIconOnly
              kind="ghost"
              size="sm"
              onClick={metaPanelHandler}
            />
          )}
      </div>
    </div>
    </div>
  );
};

AddSelectRow.propTypes = {
  appliedModifiers: PropTypes.array,
  displayMetalPanel: PropTypes.object,
  filteredItems: PropTypes.array,
  focus: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.number,
  item: PropTypes.object,
  metaIconDescription: PropTypes.string,
  modifiers: PropTypes.object,
  multi: PropTypes.bool,
  multiSelection: PropTypes.array,
  navIconDescription: PropTypes.string,
  parentId: PropTypes.string,
  parentSelected: PropTypes.string,
  setAppliedModifiers: PropTypes.func,
  setDisplayMetaPanel: PropTypes.func,
  setFocus: PropTypes.func,
  setMultiSelection: PropTypes.func,
  setParentSelected: PropTypes.func,
  setSingleSelection: PropTypes.func,
  setSize: PropTypes.number,
  singleSelection: PropTypes.string,
};

AddSelectRow.displayName = componentName;
