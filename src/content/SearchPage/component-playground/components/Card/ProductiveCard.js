/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ProductiveCard as CCProductiveCard } from '@carbon/ibm-products';
import { TrashCan, Edit } from '@carbon/react/icons';
import { StatusIcon } from '@carbon/ibm-products';
import { Column, Dropdown, Grid } from '@carbon/react';
import { setIsMulti, setOpenTask } from '../../../../../actions/task';
import { useDispatch } from 'react-redux';

const ProductiveCard = (props) => {
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
  const status = {
    "In Progress": { index: 8,type: 'in-progress', label: 'In progress' },
    "Completed": { index: 6,type: 'normal', label: 'Completed' },
    "Pending": { index: 10,type: 'pending', label: 'Preparing' },
    "To Do": { index: 7,type: 'info', label: 'To Do' },
  }
  const dispatch = useDispatch();
  const [statusIconKind , setStatusIconKind] = useState(
    status[props.data.status]
  );

  const handleTaskOpen = (isMulti) => {
    if(isMulti==='multi') {
    dispatch(setIsMulti(true));
    dispatch(setOpenTask(true));
    } else {
      dispatch(setIsMulti(false));
      dispatch(setOpenTask(true));
    }
  };

  const actionIcons = [
    {
      id: '1',
      icon: () => (
        <StatusIcon
          iconDescription={statusIconKind?.label}
          kind={statusIconKind?.type}
          size="sm"
          theme="dark"
        />
      ),
      iconDescription: statusIconKind?.label,
    }
  ];

  return (
    <CCProductiveCard
      label={props.data.user ? `${props.data.user.first_name} ${props.data.user.last_name}` : 'No Author'}
      actionIcons={actionIcons}
      actionsPlacement="bottom"
      // onClick={()=>handleTaskOpen('single')}
      description={props.data.short_description}
      // overflowActions={}
      onPrimaryButtonClick={() => handleTaskOpen('single')}
      primaryButtonText={"View"}
      secondaryButtonText={"Start"}
      onSecondaryButtonClick={() => handleTaskOpen('multi')}
      title={props.data.name}
    >
      <Grid>
        <Column lg={2}>Cost Estimation</Column>
        <Column lg={2}>₹ {props?.data?.cost?.estimated}</Column>
      </Grid>
      <Grid>
        <Column lg={2}>Time Estimation</Column>
        <Column lg={2}>{props?.data?.time?.estimated?Math.min(...props?.data?.time?.estimated?.map(val=>parseInt(val?.value)))/5>=1?`${Math.min(...props?.data?.time?.estimated?.map(val=>parseInt(val?.value)))/5} days`:`${Math.min(...props?.data?.time?.estimated?.map(val=>parseInt(val?.value)))} hours`:'0 hours'}</Column>
      </Grid>
      <Grid>
        <Column lg={2}>Number of Users</Column>
        <Column lg={2}>{props?.data?.time?.estimated?.length}</Column>
      </Grid>
    </CCProductiveCard>
  );
};
ProductiveCard.propTypes = {
  actions: PropTypes.object,
  data: PropTypes.object,
  index: PropTypes.number,
};

export default ProductiveCard;
