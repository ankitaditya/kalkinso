import React, { useEffect, useState } from 'react';
import { MultiAddSelect, SingleAddSelect } from '@carbon/ibm-products';
import { Document, Group } from '@carbon/react/icons';
import { pkg } from '@carbon/ibm-products/lib/settings';
import image from '../banner.png';
import { useSelector } from 'react-redux';

const blockClass = `${pkg.prefix}--add-select__meta-panel`; // cspell:disable-line

let items = {
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

let defaultProps = {
    items: items,
    className: 'placeholder-class',
    clearFiltersText: 'Clear filters',
    closeIconDescription: 'Close',
    columnInputPlaceholder: 'Find',
    description: 'Select tasks from the list',
    globalSearchLabel: 'global search label',
    globalSearchPlaceholder: 'Find tasks',
    illustrationTheme: 'light',
    influencerTitle: 'Selected tasks',
    itemsLabel: 'tasks',
    metaIconDescription: 'View meta information',
    metaPanelTitle: 'Personal information',
    navIconDescription: 'View children',
    noResultsTitle: 'No results',
    noSelectionDescription:
      'Select a term to include the full set of the governance artifacts it contains in the governance scope.',
    noSelectionTitle: 'No tasks selected',
    noResultsDescription: 'Try again',
    onCloseButtonText: 'Cancel',
    onSubmit: (selections) => console.log(selections),
    onSubmitButtonText: 'Add',
    searchResultsTitle: 'Search results',
    title: 'Add tasks',
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


const SelectHeirarchy = ({open, isMulti, task_id , onClose, onSubmit}) => {
    const [ props, setProps ] = useState({...defaultProps});
    const { tasks, task_files } = useSelector((state) => state.task.kanban);
    const { selectedMultiTask } = useSelector((state) => state.task);
    const [ selected, setSelected ] = useState(<></>);
    const getHeirarchy = (task_id) => {
      let task = tasks;
      if(task?.subTasks?.length>0){
        return getHeirarchy(task.parentTasks[0]);
      } else {
        if(tasks.length>0){
          return {
            sortBy: ['title'],
            entries: task.map((task)=>{return {id: task._id, value: task.name, title: task.name, description: task.short_description, standard_operating_procedures: task.description, estimated_cost: task.cost.estimated, estimated_time: task.time.estimated[0]?.value}})
          }; 
        }
      }
    }
    useEffect(()=>{
      // setProps({...props, items: getHeirarchy(tasks[0]?._id)})
      // console.log("This is modified props: ",{...props, items: getHeirarchy(tasks[0]?._id)});
    },[open])
    useEffect(() => {
      console.log("This is debug props: ",props);
      if(isMulti) {
        let addedProps = {...props}
        if(selectedMultiTask){
          addedProps = {...props, items: task_files[selectedMultiTask]?task_files[selectedMultiTask]?.entries[0]?.children:[]};
        }
        setSelected(<MultiAddSelect 
          {...addedProps} 
          open={open} 
          onClose={onClose} 
          onSubmit={(e)=>{console.log("This is selected: ",e)}}
          />);
      } else {
        setSelected(<SingleAddSelect {...props}  open={open} onClose={onClose} onSubmit={onSubmit} />);
      }
      
    }, [props, isMulti, open, selectedMultiTask, task_files]);

    useEffect(() => {
      console.log("This is debug selected: ",selected);
    }, [selected]);



    return React.useMemo(
        ()=>selected,
        [selected]
    );
  };

  export default SelectHeirarchy;