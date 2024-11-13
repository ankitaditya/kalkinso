import React, { useState, forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ButtonSet, Grid, IconButton, Tag } from '@carbon/react';
import { Tearsheet, TearsheetNarrow } from '@carbon/ibm-products';
import { NotFoundEmptyState } from '@carbon/ibm-products';
import AddSelectSidebar from './AddSelectSidebar';
import { AddSelectBreadcrumbs } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectBreadcrumbs';
import { AddSelectList } from './AddSelectList';
import { AddSelectColumn } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectColumn';
import { AddSelectFilter } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectFilter';
import { AddSelectSort } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectSort';
import { sortItems, getFilteredItems } from '@carbon/ibm-products/lib/components/AddSelect/add-select-utils';
import { useItemSort } from '@carbon/ibm-products/lib/components/AddSelect/hooks/useItemSort';
import useParentSelect from '@carbon/ibm-products/lib/components/AddSelect/hooks/useParentSelect';
import usePath from '@carbon/ibm-products/lib/components/AddSelect/hooks/usePath';
import { pkg } from '@carbon/ibm-products';
import { Column } from 'carbon-components-react';
import { Add, AddFilled, Copy, Document, Edit, Folder, FolderAdd, TrashCan } from '@carbon/react/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ContextMenu } from 'primereact/contextmenu';
import { addFile, deleteFile, save } from '../../actions/kits';
import { setDeleteFile } from '../../actions/task';

pkg.component.NotFoundEmptyState = true;
pkg.component.AddSelectSidebar = true;
pkg.component.AddSelectBreadcrumbs = true;
pkg.component.AddSelectList = true;
pkg.component.AddSelectColumn = true;
pkg.component.AddSelectFilter = true;
pkg.component.AddSelectSort = true;

const blockClass = `kalkinso--add-select`;
const componentName = 'AddSelectBody';

const AddSelectBody = forwardRef(
  (
    {
      className,
      clearFiltersText,
      closeIconDescription,
      columnInputPlaceholder,
      defaultModifiers,
      description,
      filterByLabel,
      globalFilterOpts,
      globalFiltersLabel,
      globalFiltersIconDescription,
      globalFiltersPlaceholderText,
      globalFiltersPrimaryButtonText,
      globalFiltersSecondaryButtonText,
      globalSearchLabel,
      globalSearchPlaceholder,
      globalSortBy,
      illustrationTheme,
      influencerTitle,
      items,
      itemsLabel,
      metaIconDescription,
      metaPanelTitle,
      multi,
      navIconDescription,
      noResultsDescription,
      noResultsTitle,
      noSelectionDescription,
      noSelectionTitle,
      normalizedItems,
      onClose,
      onCloseButtonText,
      onSubmit,
      onSubmitButtonText,
      open,
      portalTarget,
      searchResultsTitle,
      sortByLabel,
      title,
      useNormalizedItems,
      ...rest
    },
    ref
  ) => {
    // hooks
    const [singleSelection, setSingleSelection] = useState('');
    const [multiSelection, setMultiSelection] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedGlobalFilters, setAppliedGlobalFilters] = useState({});
    const [displayMetalPanel, setDisplayMetaPanel] = useState({});
    const [appliedModifiers, setAppliedModifiers] = useState(defaultModifiers);
    const { sortDirection, setSortDirection, sortAttribute, setSortAttribute } =
      useItemSort();
    const [ itemToDelete, setItemToDelete ] = useState(null);
    const [ pathExternal, setPathExternal ] = useState({});
    const { parentSelected, setParentSelected } = useParentSelect();
    const { path, setPath, pathOnclick, resetPath } = usePath(itemsLabel);
    const profile = useSelector((state) => state.profile);

    const resetState = () => {
      setSingleSelection('');
      setMultiSelection([]);
      setSearchTerm('');
      setAppliedGlobalFilters({});
      setDisplayMetaPanel({});
      setAppliedModifiers(defaultModifiers);
      setSortAttribute('');
      setSortDirection('');
      setParentSelected(null);
      resetPath();
    };

    useEffect(()=>{
      if (singleSelection) {
        setMultiSelection([singleSelection]);
      } else {
        setMultiSelection([]);
      }
    },[singleSelection])

    const onCloseHandler = () => {
      resetState();
      onClose?.();
    };

    const tearsheetClassnames = cx(className, blockClass, {
      [`${blockClass}__single`]: !multi,
      [`${blockClass}__multi`]: multi,
    });

    const globalFilterKeys = Object.keys(appliedGlobalFilters);
    const globalFiltersApplied = globalFilterKeys.length > 0;

    // handlers
    const handleSearch = (term) => {
      setSearchTerm(term);
    };

    const handleFilter = (filters) => {
      setAppliedGlobalFilters(filters);
    };

    const submitHandler = () => {
      if (multi && appliedModifiers && appliedModifiers?.length > 0) {
        const selections = multiSelection.map((item) => {
          return appliedModifiers.find((mod) => mod.id === item);
        });
        onSubmit?.(selections);
      } else if (multi && appliedModifiers?.length === 0) {
        onSubmit?.(multiSelection);
      } else {
        onSubmit?.(singleSelection);
      }
      onCloseHandler();
    };

    const setShowBreadsCrumbs = () => {
      if (useNormalizedItems === false || searchTerm || globalFiltersApplied) {
        return false;
      }
      return true;
    };

    const setShowTags = () => {
      if (searchTerm) {
        return true;
      }
      if (useNormalizedItems && multi) {
        return false;
      }
      return true;
    };

    const parentSelectionHandler = (id, title, parentId, item) => {
      setParentSelected(id);
      setPath(id, title, parentId);
    };

    useEffect(() => {
      if(path){
        setPathExternal({[path.map((item) => item.title==='Tasks'?profile.username:item.title).join('/')]:path[path.length-1]});
        // console.log('path: ', path.map((item) => item.title==='Tasks'?profile.username:item.title).join('/'));
      }
    }, [path]);

    const sortFn = sortItems(sortAttribute, sortDirection);
    const itemsToDisplay = normalizedItems&&getFilteredItems(
      useNormalizedItems,
      normalizedItems,
      searchTerm,
      globalFiltersApplied,
      globalFilterKeys,
      appliedGlobalFilters,
      sortFn,
      multi,
      items,
      path
    );
    const hasResults = itemsToDisplay&&itemsToDisplay?.length > 0;
    const dispatch = useDispatch();
    const showBreadsCrumbs = setShowBreadsCrumbs();
    const { file_context } = useSelector((state)=>state.task.kanban);
    const contextMenuItemTemplate = (item) => {
      return (
        <div className="p-d-flex p-ai-center p-jc-between" style={{ width: '250px', margin:"0.5rem", cursor:"pointer" }}>
          <span>{item.icon}</span>
          <span style={{marginLeft:"1rem"}}>{item.label}</span>
        </div>
      );
    }
    const contextMenuItems = [
      { label: 'Add', template: contextMenuItemTemplate, 
      items: [
          { label: 'File', command: (e)=>{
              dispatch(save('kalkinso.com', file_context.slice(-1)[0].id+'New Document.txt', ''));
              dispatch(addFile(file_context.slice(-1)[0].id+'New Document.txt'));
          },template: contextMenuItemTemplate, icon: <Document /> },
          { label: 'Folder', command: (e)=>{
              alert("Folder clicked");
          },template: contextMenuItemTemplate, icon: <Folder /> }
      ],
      icon: <Add /> },
      { label: 'Copy', command: (e)=>{
          alert("Copy clicked");
      },template: contextMenuItemTemplate, icon: <Copy /> },
      { label: 'Delete', command: (e)=>{
        alert("Delete clicked");
    },template: contextMenuItemTemplate, icon: <TrashCan /> }
  ];
    const showSort = (searchTerm || globalFiltersApplied) && hasResults;
    const showTags = setShowTags();
    const initialMenuItems = Array.from(contextMenuItems);
    const deleteMenuItems = [
      {
        ...contextMenuItems.slice(-1)[0],
        command: (e) => {
          if(file_context){
            dispatch(deleteFile('kalkinso.com', file_context.id, file_context.icon==='Folder'&&file_context.title!==file_context.value?file_context.value:false));
          }
        }
      }
    ]

    const commonListProps = {
      displayMetalPanel,
      metaIconDescription,
      multi,
      multiSelection,
      navIconDescription,
      path,
      setMultiSelection,
      setPath,
      setSingleSelection,
      singleSelection,
      setDisplayMetaPanel,
      parentId: path[0].id,
    };

    const sidebarProps = {
      appliedModifiers,
      closeIconDescription,
      displayMetalPanel,
      illustrationTheme,
      influencerTitle,
      items: useNormalizedItems ? normalizedItems : items?.entries,
      metaPanelTitle,
      modifiers: items?.modifiers,
      multiSelection,
      pathExternal,
      setMultiSelection,
      noSelectionDescription,
      noSelectionTitle,
      setDisplayMetaPanel,
    };
    const cm = useRef(null);
    const cm2 = useRef(null);
    const displayColumnView =
      multi && useNormalizedItems && !searchTerm && !globalFiltersApplied;

      
    // main content
    const body = normalizedItems&&(
      <Grid style={{padding: '0px'}}>
        <Column sm={2} md={3} lg={3} xlg={3} style={{margin:'0px', marginRight:"1rem"}}>
        <ContextMenu model={contextMenuItems.slice(0,-1)} ref={cm} breakpoint="767px" />
        <ContextMenu model={deleteMenuItems} ref={cm2} breakpoint="767px" />
        <div id="add-select" className={`${blockClass}__header`}>
        <AddSelectFilter
            inputLabel={globalSearchLabel}
            inputPlaceholder={globalSearchPlaceholder}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            multi={multi}
            filterOpts={globalFilterOpts}
            filtersLabel={globalFiltersLabel}
            handleFilter={handleFilter}
            primaryButtonText={globalFiltersPrimaryButtonText}
            secondaryButtonText={globalFiltersSecondaryButtonText}
            placeholder={globalFiltersPlaceholderText}
            iconDescription={globalFiltersIconDescription}
            appliedFilters={appliedGlobalFilters}
            hasFiltersApplied={globalFiltersApplied}
            clearFiltersText={clearFiltersText}
          />
          <div
            className={cx(`${blockClass}__sub-header`, {
              [`${blockClass}__sub-header-multi`]: multi,
            })}
            onContextMenu={(e)=>{
              dispatch(setDeleteFile(path));
              cm.current.show(e)
            }}
          >
            <div className={`${blockClass}__tags`} style={{marginTop:"10px", marginBottom:"10px"}}>
              {showBreadsCrumbs ? (
                <AddSelectBreadcrumbs
                  path={path}
                  onClick={pathOnclick}
                  multi={multi}
                />
              ) : (
                <p className={`${blockClass}__tags-label`}>
                  {searchTerm ? searchResultsTitle : itemsLabel}
                </p>
              )}
              {/* {showTags && (
                <Tag type="gray" size="sm">
                  {itemsToDisplay.length}
                </Tag>
              )} */}
            </div>
            {showSort && (
              <AddSelectSort
                setSortAttribute={setSortAttribute}
                setSortDirection={setSortDirection}
                sortBy={globalSortBy}
              />
            )}
          </div>
        </div>
        {displayColumnView ? (
          <div className={`${blockClass}__columns`}>
            <AddSelectColumn
              {...commonListProps}
              items={itemsToDisplay}
              columnInputPlaceholder={columnInputPlaceholder}
              header={path[0]?.title}
              filterByLabel={filterByLabel}
              sortByLabel={sortByLabel}
            />
          </div>
        ) : (
          <div
          style={{ height: '70vh', overflowY: 'auto' }}
          >
            {hasResults ? (
              <AddSelectList
                {...commonListProps}
                style={{ height: '80vh', overflowY: 'auto' }}
                filteredItems={itemsToDisplay}
                modifiers={items?.modifiers}
                itemToDelete={itemToDelete}
                setItemToDelete={setItemToDelete}
                cm={cm2}
                appliedModifiers={appliedModifiers}
                setAppliedModifiers={setAppliedModifiers}
                setParentSelected={parentSelectionHandler}
                parentSelected={parentSelected}
                parentId={parentSelected || path[0].id}
              />
            ) : (
              <div className={`${blockClass}__body`}>
                <NotFoundEmptyState
                  subtitle={noResultsDescription}
                  title={noResultsTitle}
                  illustrationTheme={illustrationTheme}
                />
              </div>
            )}
          </div>
        )}
        </Column>
        <Column sm={2} md={5} lg={13} xlg={13} style={{margin:"0px", marginLeft:"1rem"}}>
            <AddSelectSidebar {...sidebarProps} />
        </Column>
      </Grid>
    );

    // if (multi) {
    //   return (
    //     <Tearsheet
    //       {...commonTearsheetProps}
    //       influencer={multi && }
    //       influencerPosition="right"
    //     >
    //       {body}
    //     </Tearsheet>
    //   );
    // }

    // return <TearsheetNarrow {...commonTearsheetProps}>{body}</TearsheetNarrow>;
    return body?body:<></>;
  }
);

AddSelectBody.propTypes = {
  className: PropTypes.string,
  clearFiltersText: PropTypes.string,
  closeIconDescription: PropTypes.string,
  columnInputPlaceholder: PropTypes.string,
  defaultModifiers: PropTypes.array,
  description: PropTypes.string,
  filterByLabel: PropTypes.string,
  globalFilterOpts: PropTypes.array,
  globalFiltersIconDescription: PropTypes.string,
  globalFiltersLabel: PropTypes.string,
  globalFiltersPlaceholderText: PropTypes.string,
  globalFiltersPrimaryButtonText: PropTypes.string,
  globalFiltersSecondaryButtonText: PropTypes.string,
  globalSearchLabel: PropTypes.string.isRequired,
  globalSearchPlaceholder: PropTypes.string,
  globalSortBy: PropTypes.array,
  illustrationTheme: PropTypes.oneOf(['light', 'dark']),
  influencerTitle: PropTypes.string,
  items: PropTypes.shape({
    modifiers: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      options: PropTypes.array,
    }),
    sortBy: PropTypes.array,
    filterBy: PropTypes.array,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        avatar: PropTypes.shape({
          alt: PropTypes.string,
          icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
          src: PropTypes.string,
          theme: PropTypes.oneOf(['light', 'dark']),
        }),
        children: PropTypes.object,
        icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        id: PropTypes.string.isRequired,
        meta: PropTypes.oneOfType([
          PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string,
              title: PropTypes.string,
              value: PropTypes.string,
            })
          ),
          PropTypes.node,
        ]),
        subtitle: PropTypes.string,
        title: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }),
  itemsLabel: PropTypes.string,
  metaIconDescription: PropTypes.string,
  metaPanelTitle: PropTypes.string,
  multi: PropTypes.bool,
  navIconDescription: PropTypes.string,
  noResultsDescription: PropTypes.string,
  noResultsTitle: PropTypes.string,
  noSelectionDescription: PropTypes.string,
  noSelectionTitle: PropTypes.string,
  normalizedItems: PropTypes.object,
  onClose: PropTypes.func,
  onCloseButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  onSubmitButtonText: PropTypes.string,
  open: PropTypes.bool,
  portalTarget: PropTypes.node,
  searchResultsTitle: PropTypes.string,
  sortByLabel: PropTypes.string,
  title: PropTypes.string,
  useNormalizedItems: PropTypes.bool,
};

AddSelectBody.displayName = componentName;

export default AddSelectBody;
