import React, { useEffect, useState } from 'react';
import {
  Button,
  ClickableTile,
  Column,
    Grid,
    Loading,
} from '@carbon/react';
import './Dashboard.scss';
import { pkg } from '@carbon/ibm-products';
import AddSelectBody from './AddSelectBody';
import { normalize, getGlobalFilterValues } from '@carbon/ibm-products/lib/components/AddSelect/add-select-utils';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedTasks } from '../../actions/kits';
import { Folder, SkipBack } from '@carbon/react/icons';
import { useNavigate } from 'react-router-dom';
pkg.component.UserAvatar = true;
pkg.component.ExpressiveCard = true;
pkg.component.StatusIcon = true;
pkg.component.NotFoundEmptyState = true;

const DashboardTools = () => {
    const { tasks } = useSelector((state) => state.task.kanban);
    const profile = useSelector((state) => state.profile);
    const { selectedTask } = useSelector((state) => state.kits);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [items, setItems] = useState({});
    const [back, setBack] = useState([]);
    useEffect(()=>{
      if(profile?.user&&!selectedTask?.entries?.length){
        dispatch(getSelectedTasks("kalkinso.com",`users/${profile.user}/tasks/tools`));
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
      if(selectedTask?.entries[0]?.children?.entries?.filter(obj=>obj.title==='design-assistant')?.length>0&&selectedTask?.entries[0]?.children?.entries?.filter(obj=>obj.title==='design-assistant')[0].children?.entries?.filter(obj=>obj.title==='images')){
        localStorage.setItem('images', JSON.stringify(selectedTask?.entries[0]?.children?.entries?.filter(obj=>obj.title==='design-assistant')[0].children?.entries?.filter(obj=>obj.title==='images')[0].children?.entries));
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
        setAddSelectComponent(<><Grid>
          {back.length>0&&<Column lg={16} md={8} sm={2}>
          <Button size='sm' kind="secondary" style={{
          marginBottom: '1rem',
          // marginLeft: '4rem',
          float: 'left',
        }} onClick={()=>{
          const newBack = back.slice(0,back.length-1);
          setAddSelectComponent(back[back.length-1]);
          setBack(newBack);
        }}><SkipBack style={{
          // marginBottom: '1rem',
          marginRight: '1rem',
          // float: 'left',
        }} />Back</Button>
        </Column>}
          {selectedTask?.entries[0]?.children?.entries?.map((obj)=>{
            return <Column lg={4} md={2} sm={2}>
            <ClickableTile onClick={(e)=>{setBack([...back, addSelectComponent]); setAddSelectComponent(<><Grid>
          <Column lg={16} md={8} sm={2}>
          <Button size='sm' kind="secondary" style={{
          marginBottom: '1rem',
          float: 'left',
        }} onClick={()=>{
          navigate(`/tools/home`); window.location.reload();
        }}><SkipBack style={{
          // marginBottom: '1rem',
          marginRight: '1rem',
          // float: 'left',
        }} />Back</Button>
        </Column>{obj?.children?.entries?.map((val)=>{
              return <Column lg={4} md={2} sm={2}>
                        <ClickableTile onClick={(e)=>{
                          localStorage.setItem('selectedTool', JSON.stringify({
                            name: obj.title,
                            entries: obj?.children?.entries,
                            selectedEntry: val,
                          }));
                          console.log('Selected Tool:', {
                            name: obj.title,
                            entries: obj?.children?.entries,
                            selectedEntry: val,
                          });
                          navigate(`/tools/${obj.title}`);
                          window.location.reload();
                        }} title={val.icon}>
                          <Folder style={{
                            marginRight: '1rem',
                          }} /> <strong>{val.title}</strong>
              </ClickableTile>
              </Column>
            })}</Grid></>)}} title={obj.icon}>
              <Folder style={{
                marginRight: '1rem',
              }} /> <strong>{obj.title.split('-')[0].slice(0,1).toLocaleUpperCase()+obj.title.split('-')[0].slice(1)} {obj.title.split('-')[1].slice(0,1).toLocaleUpperCase()+obj.title.split('-')[1].slice(1)}</strong>
            </ClickableTile>
        </Column>
          })}
        </Grid></>);
      }
    }, [selectedTask, items, normalizedItems, useNormalizedItems, globalFilterOpts]);
    return addSelectComponent;

  };

export default DashboardTools;
