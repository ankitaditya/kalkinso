/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { PageHeader as CCPageHeader } from '@carbon/ibm-products';
import { Lightning, Gears, Edit, Search } from '@carbon/react/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ProgressBar } from '@carbon/react';

const ProgresBarDemo = (props) => {
  const size = 728;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(currentProgress => {
          const advancement = Math.random() * 8;
          if (currentProgress + advancement < size) {
            return currentProgress + advancement;
          } else {
            clearInterval(interval);
            return size;
          }
        });
      }, 50);
    }, 3000);
  }, []);
  const running = progress > 0;
  let helperText = running ? `${progress.toFixed(1)}MB of ${size}MB` : 'Fetching assets...';
  if (progress >= size) {
    helperText = 'Done';
  }
  return <ProgressBar {...props} value={running ? progress : null} style={{width:"50rem"}} max={size} size='small' type='inline' status={progress === size ? 'finished' : 'active'} label={helperText} helperText={helperText} />;
};

const getActions = (item, props, taskIndex) => {
  switch (item) {
    case 1:
      return {
        key: `${item}_action_bar_item`,
        renderIcon:(props)=><Edit size={16} {...props} />,
        iconDescription: `Action ${item}`,
        label: 'Edit',
        onClick: () => {
          props.actions.setSidePanelOpen(true);
          props.actions.setCardToEdit(taskIndex);
        },
      }
    case 2:
      return {
        key: `${item}_action_bar_item`,
        renderIcon:(props)=><Lightning size={16} {...props} />,
        iconDescription: `Action ${item}`,
        label: 'Boost',
        onClick: () => {
          alert('Boosting task');
        },
      }
    case 3:
      return {
        key: `${item}_action_bar_item`,
        renderIcon:(props) => <Search size={16} {...props} />,
        iconDescription: `Action ${item}`,
        label: 'Search',
        onClick: () => {
          window.location.href = '/#/search';
        },
      }
    case 4:
        return {
          key: `${item}_action_bar_item`,
          renderIcon:(props) => <ProgresBarDemo {...props} />,
          style: {minWidth:"50rem", marginRight:"20rem"},
        }
    default:
      return {
        key: `${item}_action_bar_item`,
        renderIcon:(props)=><Lightning size={16} {...props} />,
        iconDescription: `Action ${item}`,
        label: 'Boost',
        onClick: () => {
          alert('Boosting task');
        },
      }
  }
}

const PageHeader = (props) => {
  const colors = ['blue', 'green', 'warm-gray', 'purple', 'red', 'magenta', 'cyan', 'teal', 'gray', 'cool-gray', 'warm-gray', 'high-contrast', 'high-contrast-inverse']; 
  const { taskPath } = useParams();
  const [ isHome, setIsHome ] = useState(false);
  const { tasks } = useSelector((state) => state.task.kanban);
  const [ taskCard, setTaskCard ] = useState({});
  const [ taskIndex, setTaskIndex ] = useState(0);
  const [ actionBarItems, setActionBarItems ] = useState([2,3].map((item, index) => getActions(item, props, taskIndex)));
  const [ tags, setTags ] = useState(taskCard?.skills?.map((skill, index) => ({
    type: colors[index % colors.length],
    label: skill,
    })));
  const [ breadcrumb, setBreadcrumb ] = useState([
    {
      label: 'Home',
      key: 'home',
      isCurrentPage: true,
      onClick: () => {
        window.location.href = '/#/home/create';
      },
    }
  ]);
  useEffect(() => {
    
    if(taskPath === 'create'){
      setIsHome(true);
      setBreadcrumb([{
        label: 'Home',
        key: 'home',
        isCurrentPage: true,
        onClick: () => {
          window.location.href = '/#/home/create';
        },
      }])
      setActionBarItems([2,3].map((item, index) => getActions(item, props, taskIndex)))
    }else if(taskPath && tasks.length>0){
      tasks.forEach((task, index) => {
        if(taskPath?.split("&&").slice(-1)[0]===task._id){
          setTaskIndex(index);
          setTaskCard(task);
          setActionBarItems([4,2, 3, 1].map((item, index) => getActions(item, props, taskIndex)))
          setTags(task.skills?.map((skill, index) => ({
            type: colors[index % colors.length],
            label: skill,
          })));
          setIsHome(false);
        }
      });
      if (taskPath?.split("&&").length === 1) { 
         let tempBreadcrumb = [
          {
            label: 'Home',
            key: 'home',
            isCurrentPage: false,
            onClick: () => {
              window.location.href = '/#/home/create';
            },
          },
        ]
        setBreadcrumb(tempBreadcrumb);
        return;
       }
      let tempBreadcrumb = [
        {
          label: 'Home',
          key: 'home',
          isCurrentPage: false,
          onClick: () => {
            window.location.href = '/#/home/create';
          },
        }, 
        ...taskPath?.split("&&").slice(0,-1).map(
          (path, index)=>{
            if(index === taskPath.split("&&").length-1){
              return {
                label: tasks.find(task=>task._id===path)?tasks.find(task=>task._id===path).name:path, 
                key: path, 
                isCurrentPage: true, 
                onClick: () => {
                  window.location.href = `/#/home/${taskPath.split("&&").slice(0, index+1).join("&&")}`;
                }
              }
            }
            return {
              label: tasks.find(task=>task._id===path)?tasks.find(task=>task._id===path).name:path, 
              key: path, 
              isCurrentPage: false, 
              onClick: () => {
                window.location.href = `/#/home/${taskPath.split("&&").slice(0, index+1).join("&&")}`;
              }
            }
          }
      )];
      setBreadcrumb(tempBreadcrumb);
    }
  }, [taskPath,tasks]);
  const content = (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          // stylelint-disable-next-line carbon/layout-token-use
          marginRight: '50px',
          maxWidth: '400px',
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{
        taskCard?.description
        }</Markdown>
      </div>
      <p>
        Cost Estimation: {taskCard?.cost?.estimated}
        <br />
        Time Estimation: {taskCard?.time?.estimated?Math.min(...taskCard?.time?.estimated?.map(val=>parseInt(val?.value)))/5>=1?`${Math.min(...taskCard?.time?.estimated?.map(val=>parseInt(val?.value)))/5} days`:`${Math.min(...taskCard?.time?.estimated?.map(val=>parseInt(val?.value)))} hours`:'0 hours'}
        <br />
        Number of Users: {taskCard?.time?.estimated?.length}
        <br />
        <AvatarGroup>
          <Avatar image={taskCard?.user?.avatar} shape='circle' />
          <Avatar image={taskCard?.user?.avatar} shape='circle' />
          <Avatar label='+2' shape='circle' />
        </AvatarGroup>
      </p>
    </div>
  );

  return (
    <CCPageHeader
      actionBarOverflowAriaLabel="label"
      breadcrumbs={breadcrumb}
      breadcrumbOverflowAriaLabel="View breadcrumbs"
      actionBarItems={actionBarItems}
      title={isHome?"Kalkinso Task Board":taskCard?.name}
      enableBreadcrumbScroll={true}
      pageActionsOverflowLabel="Actions..."
      pageActions={[
        // {
        //   key: 'secondary',
        //   kind: 'secondary',
        //   label: 'Secondary button',
        //   render: props.switchComponent,
        //   onClick: () => {},
        // },
        {
          key: 'primary',
          kind: 'primary',
          label: 'Create new task',
          onClick: () => {
            props.setIsOpen(true);
          },
        },
      ]}
      subtitle="Help manage your team's tasks"
      tags={tags}
    >
      {!isHome&&content}
      {/* {props.switchComponent} */}
    </CCPageHeader>
  );
};
PageHeader.propTypes = {
  setIsOpen: PropTypes.func,
};

export default PageHeader;
