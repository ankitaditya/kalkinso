/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  SidePanel as CCSidePanel,
  UserProfileImage,
} from '@carbon/ibm-products';
import {
  Column,
  NumberInput,
  RadioButton,
  RadioButtonGroup,
  Row,
  TextInput,
  FormGroup,
  usePrefix,
  FilterableMultiSelect,
  Dropdown,
  DatePicker,
  DatePickerInput,
  Button,
} from '@carbon/react';
import { pkg } from '@carbon/ibm-products/lib/settings';

import costaPic from '../../_story-assets/costa.jpeg';
import { TextArea } from 'carbon-components-react';
import FileUploaderDragAndDrop from '../../../../Kanban/component-playground/components/CreateTearsheet/FileUploaderDragAndDrop';
import { skills } from '../../../../Kanban/component-playground/components/CreateTearsheet/constants';
import { Add } from '@carbon/react/icons';

const SidePanelSearch = (props) => {
  const carbonPrefix = usePrefix();
  const [editValues, setEditValues] = useState(props.data);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isCustmTime, setIsCustmTime] = useState(true);
  const blockClass = `${pkg.prefix}--create-side-panel`;
  const users = [
    {
      "user": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "mobile": "1234567890",
      "upi": "john.doe@upi",
      "adhar": "111122223333",
      "terms_conditions": true,
      "avatar": "avatar1.png",
      "date": "2024-07-24"
    },
    "status": "Pending",
      "date": "2023-03-11T18:21:23.538Z",
      "isVolunteer": true,
      "rating": 1
  },
    {
      "user": {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane.doe@example.com",
      "mobile": "0987654321",
      "upi": "jane.doe@upi",
      "adhar": "444455556666",
      "terms_conditions": true,
      "avatar": "avatar2.png",
      "date": "2024-07-24"
    },
    "status": "Pending",
      "date": "2023-03-11T18:21:23.538Z",
      "isVolunteer": true,
      "rating": 1
    },
    // ... 8 more users
  ]
  const updateCards = () => {
    let tmpCards = Array.from(props.cards);
    tmpCards.splice(props.index, 1, editValues);
    props.actions.setCards(tmpCards);
  };

  useEffect(() => {
    setEditValues(props.data);
  }, [props.data]);
  return (
    <CCSidePanel
      actions={[
        {
          kind: 'primary',
          label: 'Save changes',
          onClick: () => {
            updateCards();
            props.setIsOpen(false);
          },
        },
      ]}
      formDescription="description here"
      formTitle="form title"
      includeOverlay
      open={props.isOpen}
      subtitle="Edit the values of the topic."
      title={`Edit ${editValues.name}`}
      selectorPageContent="#cloud-and-cognitive-page-content"
      onRequestClose={() => {
        props.setIsOpen(false);
      }}
    >
      <FormGroup
        className={`${blockClass}__form`}
      >
        <div className={`${carbonPrefix}--col-lg-16`}>
        <TextInput
              labelText="Task name"
              id="tearsheet-multi-step-story-text-input-multi-step-1"
              value={editValues.name ? editValues.name : ''}
              placeholder="Enter task name"
              onChange={(event) => {
                setEditValues({
                  ...editValues,
                  [event.target.name]: event.target.value
                });
                //   if (event.target.value.length) setIsInvalid(false);
                //   setStepOneTextInputValue(event.target.value);
              }}
              name="name"
              invalid={false}
              invalidText="This is a required field"
            />
            <TextArea
              labelText="Description"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-2"
              rows={4}
              //value={topicDescriptionValue}
              value={editValues ? editValues.description : ''}
              placeholder="Enter task description"
              name="description"
              onChange={(event) =>
                setEditValues({
                  ...editValues,
                  [event.target.name]: event.target.value
                })
              }
            />
            <TextInput
              labelText="Author"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
              value={editValues?.user?.first_name+' '+editValues?.user?.last_name}
              name="author"
              placeholder="Enter Author Name"
              disabled
              // onChange={(event) =>
              //   setEditValues({
              //     ...editValues,
              //     topic: {
              //       ...editValues.topic,
              //       [event.target.name]: event.target.value,
              //     },
              //   })
              // }
            />
              <Dropdown
                    items={['In Progress', 'Completed', 'To Do']}
                    id="create-side-panel-kit-a" 
                    titleText="Current Status"
                    label="Assign a status" 
                    // selectionFeedback="top-after-reopen"
                    className={`form-item`} 
                    placeholder="Assign a status" 
                    initialSelectedItem={editValues?.status} 
                    onChange={event => {
                      setEditValues({
                        ...editValues,
                        status: event.selectedItem
                    })
                    }}
                    itemToString={(item)=>item} 
                  />
            <FilterableMultiSelect
                  items={skills}
                  id="create-side-panel-skills-a" 
                  titleText="Skills"
                  label="Select Skills" 
                  selectionFeedback="top-after-reopen"
                  className={`form-item`} 
                  placeholder="Type your skills" 
                  selectedItems={editValues?.skills}
                  onChange={event => {
                    setEditValues({
                      ...editValues,
                      skills: event.selectedItems
                  })
                  }}
                  itemToString={(item)=>item} />
                <Dropdown
                    items={['Very Low', 'Low', 'High', 'Very High', 'Critical', 'Blocker', 'Urgent']}
                    id="create-side-panel-kit-a" 
                    titleText="Priority"
                    label="Assign a priority" 
                    // selectionFeedback="top-after-reopen"
                    className={`form-item`} 
                    placeholder="Assign a priority" 
                    initialSelectedItem={editValues?.priority} 
                    onChange={event => {
                      setEditValues({
                        ...editValues,
                        priority: event.selectedItem
                    })
                    }}
                    itemToString={(item)=>item} 
                  />
            <FileUploaderDragAndDrop
              {...{
                labelText: 'Drag and drop files here or click to upload',
                name: '',
                multiple: true,
                accept: ['.jpg', '.png','.pdf','.mp4','.doc','.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv'],
                disabled: false,
                tabIndex: 0,
                attachments: editValues.attachments,
                setattachments: (files) => setEditValues({ ...editValues, attachments: files }),
              }} />
            <DatePicker id="date-picker" datePickerType="single">
              <DatePickerInput
                labelText="Date published"
                id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
                value={editValues.date ? editValues.date : ''}
                name="date"
                placeholder="mm/dd/yyyy"
                onChange={(event) =>
                  setEditValues({
                    ...editValues,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </DatePicker>
            {/* {hasSubmitError && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle="Resolve errors to continue"
                  onClose={() => setHasSubmitError(false)}
                />
              )} */}
        </div>
      </FormGroup>

      {/* <TextInput
                labelText="Date published"
                id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
                //value={props.data.topic.data}
                name="date"
                placeholder="mm/dd/yyyy"
                onChange={(event) => {}
                    //setEditValues({...editValues, "topic" : { ...editValues.topic, [event.target.name] : event.target.value}})
                }
              /> */}

      <FormGroup
        className={`${blockClass}__form`}
      >
        <div className={`${carbonPrefix}--col-lg-16`}>
        <Row>
          <Column lg={12} md={8} sm={8}>
            <TextInput
              iconDescription="Give an estimated cost for the task"
              id="carbon-number"
              value={editValues.cost ? `₹ ${editValues.cost.estimated}` : '₹ 1000'}
              name="partitions"
              label="Partitions"
              helperText="₹ 1000 is sufficient for a small task, ₹ 10000 for a medium task, ₹ 100000 for a large task"
              invalidText="Max partitions is 100, min is 1"
              onChange={(event) => {
                const regex = /^₹\s*[0-9]+/;
                if (regex.test(event.target.value)||event.target.value==='₹ ') {
                  setEditValues({
                    ...editValues,
                    cost: {
                      ...editValues.cost,
                      estimated: event.target.value.replace('₹ ', ''),
                    },
                  });
                }
              }}
            />
          </Column>
          <Column lg={4} md={8} sm={8}>
            <Button kind="ghost" size="sm" >
              Add <Add size={20}/>
            </Button>
          </Column>
        </Row>
        </div>
        
      </FormGroup>
      <FormGroup
        className={`${blockClass}__form`}
      >
        <div className={`${carbonPrefix}--col-lg-16`}>
          <Row>
            <Column lg={16} md={8} sm={8}>
            <FilterableMultiSelect
                items={users}
                id="create-side-panel-skills-a" 
                titleText="Select Members"
                label="Select Members" 
                selectionFeedback="top-after-reopen"
                className={`form-item`} 
                placeholder="Type username or email" 
                selectedItems={editValues?.assigned}
                onChange={event => {
                  setEditValues({
                    ...editValues,
                    assigned: event.selectedItems
                })
                }}
                itemToString={(item)=>item?.user?.first_name+' '+item?.user?.last_name} />
              <RadioButtonGroup
                id="Time Estimation"
                legendText="Time Estimation"
                name="time-estimation"
                defaultSelected="one-day"
                valueSelected="one-day"
                onChange={(event) => {
                  if(event==='custom') {
                    setIsCustmTime(false);
                  } else {
                    setIsCustmTime(true);
                  }
                  setEditValues({ ...editValues, time: {estimated: [...editValues.assigned.map(usr=>{return {user:usr.user, value: parseInt(event)}})], actual: {...editValues.time.actual}} });
                }}
                orientation="vertical"
              >
                <RadioButton labelText="1 Hour" value="1" id="one-hour" />
                <RadioButton labelText="8 Hours" value={`${8}`} id="one-day" />
                <RadioButton
                  labelText="5 days"
                  value={`${8*5}`}
                  id="one-week"
                />
                <RadioButton
                  labelText="20 days"
                  value={`${8*20}`}
                  id="one-month"
                />
                <RadioButton labelText="Custom" value="custom" id="custom" />
              </RadioButtonGroup>
              <NumberInput 
                id="custom-time" 
                label="Custom time" 
                defaultValue={1} 
                min={1} 
                max={120} 
                step={1} 
                onChange={(event) => {
                    setEditValues({ ...editValues, time: {estimated: [...editValues.assigned.map(usr=>{return {user:usr.user, value: event.target.value}})], actual: {...editValues.time.actual}} });
                  }
                }
                disabled={isCustmTime} />
            </Column>
          </Row>
        </div>
      </FormGroup>
    </CCSidePanel>
  );
};
SidePanelSearch.propTypes = {
  actions: PropTypes.object,
  cards: PropTypes.object,
  data: PropTypes.object,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};
export default SidePanelSearch;
