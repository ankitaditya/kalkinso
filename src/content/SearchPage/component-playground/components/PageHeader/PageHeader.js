/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { PageHeader as CCPageHeader, ConditionBuilder, pkg } from '@carbon/ibm-products';
import { Lightning, Bee, Add } from '@carbon/react/icons';
import { sampleDataStructure_tree } from './assets/sampleData';
import Gallery from '../../../Gallery/Gallery';
import { TextInput } from '@carbon/react';
import './PageHeader.css';
import { inputData } from './assets/sampleInput';
import { translationsObject } from './assets/translationsObjects';
import { setTasks } from '../../../../../actions/task';
import { setLoading } from '../../../../../actions/auth';
import { useDispatch } from 'react-redux';

pkg.component.ConditionBuilder = true;

const PageHeader = (props) => {
  const [tagInput, setTagInput] = useState('');
  const dispatch = useDispatch();
  const filterButtonTag = { type: 'purple', label: 'Filter +', id: "input-tag", onClick: () => editTagHandler("add") };
  const filterInputTag = { type: 'outline', label: <input style={{border:"none"}} onChange={(e)=>{setTagInput(e.target.value)}} onKeyDown={(event)=>addTagHandler(event)} />, id: "input-tag", filter: true, onClose: () => editTagHandler("close") };
  const [ tags, setTags ] = useState([filterButtonTag]);
const editTagHandler = (addOrClose) => {
  if (addOrClose === "add") {
    // console.log("This is updated Tags after ADD: ",[filterInputTag, ...tags.slice(1)]);
    setTags([filterInputTag, ...tags.slice(1)]);
  } else if (addOrClose === "close") {
    setTags([filterButtonTag, ...tags.slice(1)]);
  } else if(addOrClose){
    setTags(tags.filter(tag => tag.id !== addOrClose));
  }
};
const addTagHandler = (event) => {
  if(event.key === "Enter") {
    const inputText = event.target.value;
    setTags([filterButtonTag, {
      id: inputText.trim().toLowerCase().replace(' ','_')+'_1',
      type: 'purple',
      label: `${inputText}`,
      filter: true,
      onClose: () => editTagHandler(inputText.trim().toLowerCase().replace(' ','_')+'_1'),
    }, ...tags.slice(1)]);
    setTagInput('');
  }
}

useEffect(() => {
  // console.log("This is updated Tags: ",[filterInputTag, ...tags.slice(1)]);
  // console.log("This is the text: ",tagInput);
}, [tags, tagInput]);
  const content = (
    <div style={{ display: 'flex' }}>
      <p
        style={{
          // stylelint-disable-next-line carbon/layout-token-use
          marginRight: '50px',
          maxWidth: '400px',
        }}
      >
        The component playground allows a developer or designer to see how the
        components function in a &lsquo;real-world&rsquo; setting. Click around
        and see how the animations behave.
      </p>
      <p>
        Property: Value
        <br />
        Property: Value
        <br />
        Property: Value
      </p>
    </div>
  );

  const actionBarItems = [1, 2, 3, 4].map((item, index) => ({
    key: `${index}_action_bar_item`,
    renderIcon:
      index % 2
        ? (props) => <Lightning size={16} {...props} />
        : (props) => <Bee size={16} {...props} />,
    iconDescription: `Action ${item}`,
    label: `Action ${item}`,
    onClick: () => {},
  }));

  const handleSearch = (ev) => {
    // console.log("This is Cards Value: ", ev.value)
    props.actions.setSearch(ev.value);
    if(ev.value){
      dispatch(setLoading(true));
      dispatch(setTasks(ev.value));
    }
    // if (!ev.value) {
    //   props.actions.setCards(props.filteredCards);
    // } else {
    //   const filter = new RegExp(ev.value, 'i');
    //   let filteredCards = props.filteredCards.filter((item) => filter.test(item.name))
    //   .concat(props.filteredCards.filter((item) => filter.test(item.description)))
    //   .concat(props.filteredCards.filter((item) => filter.test(item.user.first_name+' '+item.user.last_name)));
    //   console.log("This is Filtered Cards: ", filteredCards);
    //   let uniqueFilteredCards = []
    //   let uniqueCardNames = []
    //   filteredCards.forEach((card) => {
    //     if (!uniqueCardNames.includes(card.name)) {
    //       uniqueCardNames.push(card.name);
    //       uniqueFilteredCards.push(card);
    //     }
    //   });
      // props.actions.setCards(uniqueFilteredCards);
    // }
  };

  return (
    <CCPageHeader
      actionBarOverflowAriaLabel="label"
      // breadcrumbs={breadcrumbs}
      breadcrumbOverflowAriaLabel="View breadcrumbs"
      // actionBarItems={actionBarItems}
      title="Kalkinso Tasks Search"
      // pageActionsOverflowLabel="Actions..."
      pageActions={[
        // {
        //   key: 'secondary',
        //   kind: 'secondary',
        //   label: 'Secondary button',
        //   onClick: () => {},
        // },
        // {
        //   key: 'primary',
        //   kind: 'primary',
        //   label: 'Create new task',
        //   onClick: () => {
        //     props.setIsOpen(true);
        //   },
        // },
      ]}
      // subtitle={}
      // tags={tags}
    >
      {<><Gallery handleSearch={handleSearch} /><ConditionBuilder inputConfig={inputData} variant={"tree"} startConditionLabel="Add Condition" popOverSearchThreshold={4} /></>}
    </CCPageHeader>
  );
};
PageHeader.propTypes = {
  setIsOpen: PropTypes.func,
};

export default PageHeader;
