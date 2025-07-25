import React, { useEffect, useState } from 'react';
import {
    Loading,
} from '@carbon/react';
import './Dashboard.scss';
import { pkg } from '@carbon/ibm-products';
import AddSelectBody from './AddSelectBody';
import { normalize, getGlobalFilterValues } from '@carbon/ibm-products/lib/components/AddSelect/add-select-utils';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedTasks } from '../../actions/kits';
pkg.component.UserAvatar = true;
pkg.component.ExpressiveCard = true;
pkg.component.StatusIcon = true;
pkg.component.NotFoundEmptyState = true;

const SocialFeed = () => {
    const { tasks } = useSelector((state) => state.task.kanban);
    const profile = useSelector((state) => state.profile);
    const { selectedTask } = useSelector((state) => state.kits);
    const dispatch = useDispatch();
    const [items, setItems] = useState({});
    useEffect(()=>{
      if(profile?.user&&!selectedTask?.entries?.length){
        dispatch(getSelectedTasks("kalkinso.com",`users/${profile.user}/tasks`));
      }
    },[profile])
    const [useNormalizedItems, setUseNormalizedItems] = useState(!!items?.entries?.find((item) => item.children));
    const [normalizedItems, setNormalizedItems] = useState(useNormalizedItems ? normalize(items) : null);
    const [addSelectComponent, setAddSelectComponent] = useState(<Loading active={true}  />);
    useEffect(()=>{
      if(selectedTask?.entries?.length>0){
        setUseNormalizedItems(!!selectedTask.entries.find((item) => item.children));
        setItems(selectedTask.entries[0].children);
      }
    },[selectedTask])
    useEffect(() => {
      if(useNormalizedItems&&selectedTask?.entries?.length>0){
        setNormalizedItems(useNormalizedItems ? normalize(selectedTask.entries[0].children) : null);
      }
    }, [useNormalizedItems, selectedTask]);
    const kinds = [
      { index: 0,type: 'fatal', label: 'Fatal' },
      { index: 1,type: 'critical', label: 'Critical' },
      { index: 2,type: 'major-warning', label: 'Time warning' },
      { index: 3,type: 'minor-warning', label: 'Cost Warning' },
      { index: 4,type: 'undefined', label: 'Undefined' },
      { index: 5,type: 'unknown', label: 'Unknown' },
      { index: 6,type: 'normal', label: 'Completed' },
      { index: 7,type: 'info', label: 'To Do' },
      { index: 8,type: 'in-progress', label: 'In progress' },
      { index: 9,type: 'running', label: 'Powered' },
      { index: 10,type: 'pending', label: 'Preparing' },
    ];
      const handleOnSubmit = (selection) => {
        // console.log('Selected Items:', selection);
      };
      
      const handleOnClose = () => {
        // console.log('Tearsheet closed');
      };

    const globalFilterOpts =
      true && []?.length
        ? getGlobalFilterValues([], normalizedItems)
        : null;

    useEffect(() => {
      if (selectedTask?.entries?.length>0) {
        // console.log('Selected Items:', selectedTask);
        const defaultModifiers =
          true && items.modifiers
            ? items.entries.map((item) => {
                const modifierAttribute = items?.modifiers?.id;
                const modifier = {
                  id: item.id,
                };

                return {
                  ...modifier,
                  ...(modifierAttribute && {
                    [modifierAttribute]: item[modifierAttribute],
                  }),
                };
              })
            : [];
        setAddSelectComponent(<AddSelectBody title="Select Items"
          description="Choose items from the list"
          items={items}
          itemsLabel="Tasks"
          globalSearchLabel="Search Items"
          onCloseButtonText="Close"
          onSubmitButtonText="Submit"
          onSubmit={handleOnSubmit}
          onClose={handleOnClose}
          normalizedItems={normalizedItems}
          useNormalizedItems={useNormalizedItems}
          globalFilterOpts={globalFilterOpts}
          defaultModifiers={defaultModifiers}
          open={true}
          multi={false} />);
      }
    }, [selectedTask, items, normalizedItems, useNormalizedItems, globalFilterOpts]);
    return addSelectComponent;

  };

export default SocialFeed;
