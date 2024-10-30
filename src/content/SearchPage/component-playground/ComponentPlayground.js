/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import * as uuid from 'uuid';

import { Cascade, NotFoundEmptyState } from '@carbon/ibm-products';
import {
  GlobalHeader,
  MultiStepTearsheetWide,
  PageHeader,
  TearsheetNarrow,
  TearsheetWide,
  SidePanelSearch,
} from './components';
import { Column } from '@carbon/react';
import { useDispatch, useSelector } from 'react-redux';
import './ComponentPlayground.scss';
import { setLoading } from '../../../actions/auth';
import { ProductiveCard } from '../../Kanban/component-playground/components';

const App = () => {
  const [cards, setCards] = useState([]);
  const profile = useSelector((state) => state.profile);
  const [filteredCards, setFilteredCards] = useState([]);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cardToEdit, setCardToEdit] = useState();
  const { tasks } = useSelector((state) => state.task);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [narrowTearsheetOpen, setNarrowTearsheetOpen] = useState(false);
  const [wideTearsheetOpen, setWideTearsheetOpen] = useState(false);
  const [multiStepTearsheetOpen, setMultiStepTearsheetOpen] = useState(false);
  const [componentConfig, setComponentConfig] = useState({
    cards: {},
    loadBar: {},
    sidePanel: {},
    tagSet: {},
    tearSheet: {},
    createTearsheet: {
      title: 'Create task',
      label: 'This is the label of the multi step tearsheet',
      nextButtonText: 'Next step',
      description: 'Specify details for the new task you want to create',
      submitButtonText: 'Create',
      cancelButtonText: 'Cancel',
      backButtonText: 'Back',
    },
    modifiedTabs: {},
    pageHeader: {},
  });

  const actions = {
    setSidePanelOpen,
    setNarrowTearsheetOpen,
    setWideTearsheetOpen,
    setComponentConfig,
    setCards,
    setCardToEdit,
    setFilteredCards,
    setSearch,
  };
 
  useEffect(() => {
    setCards(tasks.filter((task) => task?.user?._id !== profile?.user));
    setFilteredCards(tasks.filter((task) => task?.user?._id !== profile?.user));
    if(loading) {
      dispatch(setLoading(false));
    }
  }, [tasks]);

  return (
    <div className="component-playground">
      {/* <GlobalHeader />
      <div
        style={{
          // stylelint-disable-next-line carbon/layout-token-use
          marginTop: '48px',
        }}
      ></div> */}
      <PageHeader setIsOpen={setMultiStepTearsheetOpen} filteredCards={filteredCards} actions={actions} cards={cards} search={search} />
      <MultiStepTearsheetWide
        cards={cards}
        isOpen={multiStepTearsheetOpen}
        setIsOpen={setMultiStepTearsheetOpen}
        componentConfig={componentConfig.createTearsheet}
        actions={actions}
      />
      {cardToEdit !== undefined && (
        <SidePanelSearch
          data={cards[cardToEdit]}
          actions={actions}
          index={cardToEdit}
          cards={cards}
          tasks={cards}
          isOpen={sidePanelOpen}
          setIsOpen={setSidePanelOpen}
          componentConfig={componentConfig}
        />
      )}

      <TearsheetNarrow
        isOpen={narrowTearsheetOpen}
        setIsOpen={setNarrowTearsheetOpen}
      />
      <TearsheetWide
        isOpen={wideTearsheetOpen}
        setIsOpen={setWideTearsheetOpen}
      />

      <Cascade grid>
        {cards.length>0?cards.map((card, index) => {
          return (
            <Column
              key={card.name}
              lg={4}
              md={4}
              sm={4}
              style={{
                // stylelint-disable-next-line carbon/layout-token-use
                marginTop: '36px',
              }}
            >
              <ProductiveCard
                data={cards[index]}
                index={index}
                cards={cards}
                tasks={cards}
                actions={actions}
                config={componentConfig}
              />
            </Column>
          );
        }):<Column lg={16} md={8} sm={6} style={{
          // stylelint-disable-next-line carbon/layout-token-use
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center' /* Centers horizontally */
        }}>
          <NotFoundEmptyState
        size="lg" 
        title="Start Searching To get Started" 
        subtitle="To get started, please Search Something."
        illustrationDescription="No tasks found"
        />
        </Column>}
      </Cascade>
    </div>
  );
};

export default App;
