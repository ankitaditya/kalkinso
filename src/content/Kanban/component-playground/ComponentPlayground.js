/**
 * Copyright IBM Corp. 2022, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cascade, ExpressiveCard, NotFoundEmptyState, pkg, StatusIcon, UserProfileImage } from '@carbon/ibm-products';
import {
  ProductiveCard,
  GlobalHeader,
  MultiStepTearsheetWide,
  PageHeader,
  SidePanel,
  TearsheetNarrow,
  TearsheetWide,
} from './components';
import { Accordion, AccordionItem, ButtonSet, ClickableTile, Column, ContentSwitcher, FileUploader, IconButton, IconSwitch, InlineLoading, Switch, TextArea, Tile, Tooltip } from '@carbon/react';
import './ComponentPlayground.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Add, Attachment, Chat, Delete, Edit, FaceActivated, FileStorage, Folder, FolderOpen, Gears, Image, Send, TableOfContents, TrashCan, User } from '@carbon/react/icons';
import { Editor } from 'primereact/editor';
import { Markup } from 'interweave';
import costaPic from './_story-assets/costa.jpeg';
import FileUploaderDragAndDrop from './components/CreateTearsheet/FileUploaderDragAndDrop';
import { useParams } from 'react-router-dom';
import { setLoading } from '../../../actions/auth';
import { getSubTasks } from '../../../actions/task';
import { Input, Button as ChatButton } from 'react-chat-elements';
import Comments from './components/Comments/Comments';
pkg.component.ProductiveCard = true;
pkg.component.Cascade = true;
pkg.component.NotFoundEmptyState = true;

const App = ({breadcrumb}) => {
  const { tasks } = useSelector((state) => state.task.kanban);
  const { taskPath } = useParams();
  const [ cardsComponent, setCardsComponent ] = useState(
    <Column lg={16} md={8} sm={6} style={{
      // stylelint-disable-next-line carbon/layout-token-use
      marginTop: '5rem',
      display: 'flex',
      justifyContent: 'center' /* Centers horizontally */
    }}>
      <NotFoundEmptyState
    size="lg" 
    title="No tasks found" 
    subtitle="To get started, please create a new task."
    illustrationDescription="No tasks found"
    action={{
      "kind": "secondary",
      "text": "Create new",
      "renderIcon": Add,
      onClick: () => setMultiStepTearsheetOpen(true)
    }}
    />
    </Column>);
  const [ data, setData ] = useState([])
  const [cards, setCards] = useState(tasks);
  const [contentSwitch, setContentSwitch] = useState({index: 0, name: 'one', text: 'Table of Contents'});
  const [sendComment, setSendComment] = useState({isSubmitting: false, success: false, failed: false});
  const [attachments, setAttachments] = useState([]);
  const [editor, setEditor] = useState(false);
  const [text, setText] = useState('');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState();
  const [narrowTearsheetOpen, setNarrowTearsheetOpen] = useState(false);
  const [wideTearsheetOpen, setWideTearsheetOpen] = useState(false);
  const [multiStepTearsheetOpen, setMultiStepTearsheetOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if(!taskPath){
      setCards(tasks);
    }
    if (taskPath === 'create') {
      setCards(tasks);
    } else if(tasks.length>0 && taskPath) {
      // console.log('Task path:', tasks.find(task => task._id === taskPath));
      let SelectedTask = tasks.find(task => task._id === taskPath.split('&&').slice(-1)[0])
      if(SelectedTask){
        console.log('This is selected task:', SelectedTask);
        setData(SelectedTask?.analytics?.commenters?SelectedTask?.analytics?.commenters:[]);
      }
      if(SelectedTask?.subTasks.length>0){
        let sub_tasks = SelectedTask.subTasks.map((subTask) => {
          let sub_tasks = tasks.find(task => task._id === subTask)
          if(sub_tasks){
            return sub_tasks;
          } else {
            return false;
          }
        });
        if(sub_tasks.length>0&&sub_tasks[0]){
          setCards(sub_tasks);
        }else {
          setCards([]);
          dispatch(setLoading(true));
          dispatch(getSubTasks(taskPath.split('&&').slice(-1)[0]));
        }
      }else{
        setCards([]);
      }
    }
  }, [tasks, taskPath]);
  useEffect(() => {
    // console.log('This is cards:', cards);
    setCardsComponent(cards.length>0?cards.map((card, index) => {
      // console.log('This is card:', card);
      if(card?.name){
        return (
          <Column
            key={card.name}
            lg={5}
            md={4}
            sm={4}
            style={{
              // stylelint-disable-next-line carbon/layout-token-use
              marginTop: '1rem',
            }}
          >
            <ProductiveCard
              data={cards[index]}
              index={index}
              cards={cards}
              actions={actions}
              config={componentConfig}
            />
          </Column>
        );
      } else {
        return <Column lg={16} md={8} sm={6} style={{
          // stylelint-disable-next-line carbon/layout-token-use
          marginTop: '5rem',
          display: 'flex',
          justifyContent: 'center' /* Centers horizontally */
        }}>
          <NotFoundEmptyState
        size="lg" 
        title="No tasks found" 
        subtitle="To get started, please create a new task."
        illustrationDescription="No tasks found"
        action={{
          "kind": "secondary",
          "text": "Create new",
          "renderIcon": Add,
          onClick: () => setMultiStepTearsheetOpen(true)
        }}
        />
        </Column>;
      }
    }):<Column lg={16} md={8} sm={6} style={{
      // stylelint-disable-next-line carbon/layout-token-use
      marginTop: '5rem',
      display: 'flex',
      justifyContent: 'center' /* Centers horizontally */
    }}>
      <NotFoundEmptyState
    size="lg" 
    title="No tasks found" 
    subtitle="To get started, please create a new task."
    illustrationDescription="No tasks found"
    action={{
      "kind": "secondary",
      "text": "Create new",
      "renderIcon": Add,
      onClick: () => setMultiStepTearsheetOpen(true)
    }}
    />
    </Column>);
  },[cards])
  const [comments, setComments] = useState([
    {
      "id": uuidv4(),
      "author": "Ankit Aditya",
      "content": "A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States.",
      "time": "2 hours ago",
      "attachments": []
    }
  ]);
  const actionIcons = (id) => [
    {
      id: '1',
      icon: (props) => <FaceActivated size={16} {...props} />,
      iconDescription: 'React',
    },
    {
      id: '2',
      name: '2',
      icon: (props) => <TrashCan size={16} {...props} />,
      iconDescription: 'Delete',
      onClick: () => {
        let newComments = [];
        comments.forEach((item) => {
          if (item.id !== id) {
            newComments.push(item);
          }
        });
        setComments(newComments);
      },
    },
    {
      id: '3',
      icon: (props) => <Send size={16} {...props} />,
      onClick: () => {
        setSendComment({isSubmitting: true, success: false, failed: false});
        setTimeout(() => {
        let newComments = [...comments];
        newComments.unshift({
          "id": uuidv4(),
          "author": "John Doe",
          "content": <Markup content={text} />,
          "time": "now",
          "attachments": [...attachments]
        });
        setComments(newComments);
        setSendComment({isSubmitting: true, success: true, failed: false});
        setTimeout(() => {
          setSendComment({isSubmitting: false, success: false, failed: false});
          setAttachments([]);
          setText('');
        }, 1000);
        }, 2000);
      },
      iconDescription: 'Comment',
    },
  ];
  const [componentConfig, setComponentConfig] = useState({
    cards: {},
    loadBar: {},
    sidePanel: {},
    tagSet: {},
    tearSheet: {},
    createTearsheet: {
      title: 'Create task',
      label: 'Create a new task which will be added to the project',
      nextButtonText: 'Next',
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
  };

  const UserInputForm = ({ onSendMessage }) => {
    const [input, setInput] = useState('');
  
    const handleChange = (event) => {
      setInput(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onSendMessage(input);
      setInput('');
    };
  
    return (
      <div style={{ width: '100%', maxWidth: "55vw", paddingBottom: '6vh', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: 'white' }}>
          <Input
            id="chat-input"
            placeholder="Type here..."
            multiline={true}
            onChange={handleChange}
            />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            float: 'left',
            marginRight: '1rem',
          }}>
          <ChatButton
                type='transparent'
                title="Send"
                onClick={()=>{}}
                color='black'
                backgroundColor='#161616'
                icon ={{
                    float:'right',
                    size:15,
                    component:<Attachment />
                }}/>
          <ChatButton
                type='transparent'
                title="Send"
                onClick={()=>{}}
                color='black'
                backgroundColor='#161616'
                icon ={{
                    float:'right',
                    size:15,
                    component:<Image />
                }}/>
          <ChatButton
                type='transparent'
                title="Send"
                onClick={()=>{}}
                color='black'
                backgroundColor='#161616'
                icon ={{
                    float:'right',
                    size:15,
                    component:<Gears />
                }}/>  
          </div>    
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            float: 'right',
          }}>
          <ChatButton
                text={"Send"}
                onClick={handleSubmit}
                type='outlined'
                title="Send"
                backgroundColor='#161616'
                style={{marginLeft:"1rem"}}
                icon ={{
                    float:'right',
                    size:15,
                    component:<Send />
                }}/>
            </div>
      </div>
    );
  };

  useEffect(() => {
    // console.log("This is switch: ",contentSwitch);
  }, [contentSwitch]);
 
  // useEffect(() => {
  //   console.log("This is breadcrumb: ",breadcrumb);
  //   if (breadcrumb.length > 0) {
  //     if (breadcrumb.length === 1 && breadcrumb[0].label === 'create') {
  //       setCards(tasks);
  //     } else {
  //       setCards(breadcrumb.map((item, index) => tasks[parseInt(item.label)]));
  //     }
  //   } else {
  //     setCards(tasks);
  //   }
  // }, [breadcrumb]);

  return (
    <div className="component-playground">
      <PageHeader 
        setIsOpen={setMultiStepTearsheetOpen} 
        breadcrumb={breadcrumb} 
        actions={actions}
        cards={cards}/>
      <MultiStepTearsheetWide
        cards={cards}
        isOpen={multiStepTearsheetOpen}
        setIsOpen={setMultiStepTearsheetOpen}
        componentConfig={componentConfig.createTearsheet}
        actions={actions}
      />
      {cardToEdit !== undefined && (
        <SidePanel
          data={cards[cardToEdit]?cards[cardToEdit]:tasks[cardToEdit]}
          actions={actions}
          index={cardToEdit}
          cards={cards[cardToEdit]?cards:tasks}
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
        <Column lg={16} md={8} sm={6} style={{
                // stylelint-disable-next-line carbon/layout-token-use
                marginTop: '1rem',
              }}>
          {taskPath !== 'create'?(<ContentSwitcher onChange={(event)=>setContentSwitch(event)} size='sm'>
            {/* <IconSwitch name="one" text="Table of Contents" align="bottom">
              <TableOfContents />
            </IconSwitch>
            <IconSwitch name="two" text="Comments" align="bottom">
              <Chat />
            </IconSwitch> */}
            <Switch name="one" text="Table of Contents" />
            <Switch name="two" text={`Comments (${data.length})`} />
          </ContentSwitcher>):<></>}
        </Column>
      </Cascade>
      

      {contentSwitch?.name==='one'&&(<Cascade grid>
        {cardsComponent}
      </Cascade>)}
      {contentSwitch?.name==='two'&&!taskPath.includes('create')&&(
        // <Cascade grid>
        //   <Column key={`comments-input-box`} lg={16} md={8} sm={4} style={{
        //     // stylelint-disable-next-line carbon/layout-token-use
        //     marginTop: '1rem'
        //     }}>
        //       {/* <ExpressiveCard style={{maxWidth: "55vw", margin:"auto"}} 
        //       label={<IconButton onClick={()=>{}} style={{marginLeft:"40vw"}} size='sm' kind='ghost' label=''>
        //                 <Edit />
        //               </IconButton>} 
        //       // title={} 
        //       mediaPosition='left' 
        //       description={
        //         <UserInputForm onSendMessage={(params) => console.log(params)} />} 
        //       key={"30"} 
        //       media={<UserProfileImage
        //           size="xl"
        //           backgroundColor="light-cyan"
        //           theme="light"
        //           style={{ margin: '1rem' }}
        //           initials="AA"
        //           tooltipText={'Ankit Aditya'}
        //           imageDescription="blank"
        //           image={costaPic}
        //         />} 
        //         // secondaryButtonText={}
        //         // secondaryButtonKind='ghost'
        //         // primaryButtonText={sendComment.isSubmitting||sendComment.success||sendComment.failed?<InlineLoading style={{
        //         //   marginLeft: '1rem'
        //         // }} description={""} status={sendComment.success ? 'finished' : 'active'} aria-live={''} />:<Send size={20} />}
        //         // primaryButtonKind='ghost'
        //         // onPrimaryButtonClick={()=>actionIcons().slice(-1)[0].onClick()}
        //         /> */}
        //         <center>
        //           <UserInputForm onSendMessage={(params) => console.log(params)} />
        //         </center>
                
        //     </Column>
        //   {comments.map((item, index) => (
        //   <Column key={`comments-box-${index}`} lg={16} md={8} sm={4} style={{
        //     // stylelint-disable-next-line carbon/layout-token-use
        //     marginTop: '1rem'
        //     }}>
        //       <ExpressiveCard actionIcons={actionIcons(item.id).slice(0,actionIcons(item.id).length-1)} style={{maxWidth: "55vw", margin:"auto"}} label={item.time} title={item.author} mediaPosition='left' description={item.content} key={"30"} 
        //       media={<UserProfileImage
        //           size="xl"
        //           backgroundColor="light-cyan"
        //           theme="light"
        //           style={{ margin: '1rem' }}
        //           initials="CC"
        //           tooltipText={'Ankit Aditya'}
        //           imageDescription="blank"
        //           image={costaPic}
        //         />} />
        //         {item?.attachments?.length>0?(<ExpressiveCard key={`attachment-${index}`} style={{maxWidth: "55vw", margin:"auto", padding: "1px"}} label={""} title={""} mediaPosition='left' 
        //             description={
        //               <Cascade grid>
        //               {item.attachments.map((attachment, index) => {
        //                 return (
        //                   <Column key={`attachment-${index}`} lg={1} md={8} sm={4}>
        //                     <Tooltip align='top' label={attachment.name}>
        //                       <ClickableTile key={`attachment-${index}`} onClick={()=>{}}>
        //                           <Image size={20} />
        //                       </ClickableTile>
        //                     </Tooltip>
        //                   </Column>
        //                 );
        //               })}
        //               </Cascade>
        //             } 
        //             media={<Attachment style={{margin:"1rem"}}/>}/>):<></>}
        //   </Column>
        //   ))}
        // </Cascade>
        <Comments data={data} setData={setData} />
      )}
    </div>
  );
};

export default App;
