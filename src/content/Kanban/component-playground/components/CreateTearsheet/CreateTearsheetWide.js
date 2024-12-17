/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  CreateTearsheet,
  CreateTearsheetStep,
} from '@carbon/ibm-products';
import {
  Column,
  DatePicker,
  DatePickerInput,
  Dropdown,
  NumberInput,
  RadioButton,
  RadioButtonGroup,
  Row,
  TextInput,
} from '@carbon/react';
import { useDispatch, useSelector } from 'react-redux';
import FileUploaderDragAndDrop from './FileUploaderDragAndDrop';
import { Button, FilterableMultiSelect, TextArea } from 'carbon-components-react';
import { skills } from './constants';
import { Add } from '@carbon/react/icons';
import StartPaymentModal from './StartPaymentModal';
import { addTask } from '../../../../../actions/task';
import { useParams } from 'react-router-dom';
import AISlug from '../../../../AISlug/AISlug';


const MultiStepTearsheetWide = (props) => {
  const dispatch = useDispatch();
  const [openPayment, setOpenPayment] = useState(false);
  const [ isCustmTime, setIsCustmTime ] = useState(true);
  const { taskPath } = useParams();
  const profile = useSelector((state) => state.profile);
  const users = [
    {
      "user": profile.user,
      "first_name": profile?.first_name,
      "last_name": profile?.last_name,
      "avatar": profile?.avatar,
      "status": "Pending",
      "isVolunteer": true,
      "rating": 1
    },
    // ... 8 more users
  ]
  
  const [createValues, setCreateValues] = useState({
    "user": {
      "first_name": profile?.first_name,
      "last_name": profile?.last_name,
      "email": profile?.email,
      "mobile": profile?.mobile,
      "upi": profile?.upi,
      "adhar": profile?.adhar,
      "terms_conditions":  profile?.terms_conditions,
      "avatar": profile?.avatar,
      "date": profile?.date
    },
    "name": "",
    "description": "",
    "short_description": "",
    "assigned": [],
    "time": {
    "estimated": [
      {
        "user": "646cbcb0f29d303de1b5df7f",
        "value": 4
      },
      {
        "user": "646cbcb0f29d303de1b5df80",
        "value": 2
      }
    ],
    "actual": {
        "user": "646cbcb0f29d303de1b5df81",
        "value": 6
    }
    },
    "cost": {
        "estimated": 384,
        "actual": 416
    },
    "org": profile?.org,
    "location": profile?.location,
    "status": "To Do",
    "skills": [],
    "analytics": {},
    "priority": "",
    "subTasks": [],
    "parentTasks": [],
    "attachments": [],
    "tags": [],
    "date": new Date().toLocaleDateString(),
    "createdAt": "2023-08-11T19:02:19.529Z",
    "updatedAt": "2023-10-21T02:32:14.518Z"
  });

  useEffect(() => {
    // console.log('createValues', createValues);
  }, [createValues]);

  useEffect(() => {
    if(Object.keys(profile).length>0&&!createValues?.user?.first_name) {
      setCreateValues({
        ...createValues,
        "user": {
        "first_name": profile?.first_name,
        "last_name": profile?.last_name,
        "email": profile?.email,
        "mobile": profile?.mobile,
        "upi": profile?.upi,
        "adhar": profile?.adhar,
        "terms_conditions":  profile?.terms_conditions,
        "avatar": profile?.avatar,
        "date": profile?.date
        },
        "org": profile?.org,
        "location": profile?.location
      });
    }
  }, [profile, createValues]);

  const aiLabel = AISlug;

  /** Write description for the task name: Create AI for Kalkinso
   * Write description for the task description: Create AI for Kalkinso's chatbot
   * Description:
   * The AI must be able to:
   * 1. Understand user input
   * 2. Generate a response
   * 3. Provide a list of options, actions, suggestions, recommendations, resources, references, links, contacts, help, support, assistance, solutions, answers
   * 4. learn from user input and improve the thought process
   * 5. Suggest How to document for the particular Idea or Project
   * 6. Suggest the best cost-effective solution for the particular Idea or Project
   * 7. Give analytics for quick decision making, problem-solving and project management
   * 8. Suggest the best way to become financially independent and think beyond the box
   */

  return (
    <CreateTearsheet
      {...props.componentConfig}
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      onRequestSubmit={() => {
        if(taskPath && taskPath!=='create') {
          dispatch(addTask(createValues, taskPath.split('&&').slice(-1)[0], taskPath));
        }else{
          dispatch(addTask(createValues));
        }
        setCreateValues({});
      }}
    >
      <StartPaymentModal openPayment={openPayment} actions={{ setOpenPayment: setOpenPayment }} />
      <CreateTearsheetStep
        title="Create new task"
        fieldsetLegendText="Task information"
        disableSubmit={!(createValues?.name&&
          createValues?.description&&
          createValues?.user.first_name&&
          createValues?.user.last_name&&
          createValues?.attachments.length>0&&
          createValues?.skills.length>0&&
          createValues?.priority&&
          createValues?.date
        )}
        subtitle="This is the name of your task."
        description="It will be displayed in the task list and can be used to search for your task."
      >
        <Row>
          <Column xlg={8} lg={8} md={8} sm={8}>
            <TextInput
              labelText="Task name"
              id="tearsheet-multi-step-story-text-input-multi-step-1"
              value={createValues.name ? createValues.name : ''}
              placeholder="Enter task name"
              onChange={(event) => {
                setCreateValues({
                  ...createValues,
                  [event.target.name]: event.target.value
                });
              }}
              name="name"
              slug={aiLabel(setCreateValues, 'name', createValues)}
              invalid={false}
              invalidText="This is a required field"
            />
            <TextArea
              labelText="Short Description"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-2-1"
              rows={4}
              value={createValues ? createValues.short_description : ''}
              placeholder="Enter task short description"
              name="short_description"
              slug={aiLabel(setCreateValues, 'short_description', createValues)}
              onChange={(event) =>
                setCreateValues({
                  ...createValues,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <TextArea
              labelText="Description"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-2-2"
              rows={4}
              //value={topicDescriptionValue}
              value={createValues ? createValues.description : ''}
              placeholder="Enter task description"
              name="description"
              slug={aiLabel(setCreateValues, 'description', createValues)}
              onChange={(event) =>
                setCreateValues({
                  ...createValues,
                  [event.target.name]: event.target.value,
                })
              }
            />
            <TextInput
              labelText="Author"
              id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
              value={createValues?.user?.first_name+' '+createValues?.user?.last_name}
              name="author"
              placeholder="Enter Author Name"
              disabled
              // onChange={(event) =>
              //   setCreateValues({
              //     ...createValues,
              //     topic: {
              //       ...createValues.topic,
              //       [event.target.name]: event.target.value,
              //     },
              //   })
              // }
            />
            <FilterableMultiSelect
                  items={skills}
                  id="create-side-panel-skills-a" 
                  titleText="Skills"
                  label="Select Skills" 
                  selectionFeedback="top-after-reopen"
                  className={`form-item`} 
                  placeholder="Type your skills" 
                  selectedItems={createValues?.skills}
                  onChange={event => {
                    setCreateValues({
                      ...createValues,
                      skills: event.selectedItems
                  })
                  }}
                  itemToString={(item)=>item} />
                <Dropdown
                    items={['Very Low', 'Low', 'High', 'Very High', 'Critical', 'Blocker', 'Urgent']}
                    id="create-side-panel-kit-a" 
                    titleText="Priority"
                    label="Assign a priority" 
                    className={`form-item`} 
                    placeholder="Assign a priority" 
                    initialSelectedItem={createValues?.priority} 
                    onChange={event => {
                      setCreateValues({
                        ...createValues,
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
                setattachments: (files) => setCreateValues({ ...createValues, attachments: files }),
              }} />
            <DatePicker id="date-picker" datePickerType="single">
              <DatePickerInput
                labelText="Date published"
                id="tearsheet-multi-step-story-text-input-multi-step-1-input-3"
                value={createValues.date ? createValues.date : ''}
                name="date"
                placeholder="mm/dd/yyyy"
                onChange={(event) =>
                  setCreateValues({
                    ...createValues,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </DatePicker>
          </Column>
        </Row>
      </CreateTearsheetStep>
      <CreateTearsheetStep
        title="Cost Estimation"
        subtitle="Give an estimated cost for the task."
        description="The cost is an estimate of the resources required to complete the task. 
        This can be used to track the budget of the project."
        fieldsetLegendText="Cost Information"
          disableSubmit={
            !(createValues.cost?.estimated||
              /^[0-9]+/.test(createValues.cost?.estimated)
            )
          }
      >
        <Row>
          <Column xlg={8} lg={8} md={8} sm={8}>
            <TextInput
              labelText="Give an estimated cost for the task"
              id="carbon-number"
              value={createValues.cost ? `₹ ${createValues.cost.estimated}` : '₹ 1000'}
              name="partitions"
              label="Partitions"
              helperText="₹ 1000 is sufficient for a small task, ₹ 10000 for a medium task, ₹ 100000 for a large task"
              invalidText="Max partitions is 100, min is 1"
              onChange={(event) => {
                setCreateValues({
                  ...createValues,
                  cost: {
                    ...createValues.cost,
                    estimated: event.target.value.replace('₹ ', '').replace('₹', ''),
                  },
                });
              }}
            />
          </Column>
          <Column xlg={8} lg={8} md={8} sm={8}>
            <Button kind="ghost" size="sm" onClick={() => setOpenPayment(true)}>
              Add <Add size={20}/>
            </Button>
          </Column>
        </Row>
      </CreateTearsheetStep>
      <CreateTearsheetStep
        title="Add Members"
        subtitle="Pre Select some Members If you want to for your tasks."
        description="Members can be assigned to the task to help complete it. You can assign multiple members to a task."
        fieldsetLegendText="Members"
        onNext={() => {
          Promise.resolve();
        }}
      >
        <Row>
          <Column xlg={8} lg={16} md={8} sm={8}>
            <FilterableMultiSelect
              items={users}
              id="create-side-panel-skills-a" 
              titleText="Select Members"
              label="Select Members" 
              selectionFeedback="top-after-reopen"
              className={`form-item`} 
              placeholder="Type username or email" 
              selectedItems={createValues?.assigned}
              onChange={event => {
                setCreateValues({
                  ...createValues,
                  assigned: event.selectedItems
              })
              }}
              itemToString={(item)=>item?.first_name+' '+item?.last_name} />
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
                setCreateValues({ ...createValues, time: {estimated: [...createValues.assigned.map(usr=>{return {user:usr.user, value: parseInt(event)}})], actual: {...createValues.time.actual}} });
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
              label="Custom Days" 
              defaultValue={1} 
              min={1} 
              max={120} 
              step={1} 
              onChange={(event) => {
                  setCreateValues({ ...createValues, time: {estimated: [...createValues.assigned.map(usr=>{return {user:usr.user, value: `${Math.round(event.target.value*8)}`}})], actual: {...createValues.time.actual}} });
                }
              }
              disabled={isCustmTime} />
          </Column>
        </Row>
      </CreateTearsheetStep>
    </CreateTearsheet>
  );
};
MultiStepTearsheetWide.propTypes = {
  actions: PropTypes.object,
  cards: PropTypes.array,
  componentConfig: PropTypes.object,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default MultiStepTearsheetWide;
