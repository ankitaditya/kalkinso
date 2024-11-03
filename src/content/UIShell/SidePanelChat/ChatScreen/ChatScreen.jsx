import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  Button,
  TextInput,
  Tile,
  Grid,
  Row,
  Column,
  FluidForm,
  // unstable__ChatButton as ChatButton,
  TextArea,
  ButtonSet,
  Loading,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  IconButton,
} from '@carbon/react';
import { Send, Attachment, Image, Gears } from '@carbon/icons-react';
import { Button as ChatButton, MessageList } from 'react-chat-elements';
import './ChatScreen.css';
import { Checkmark, Forum, Maximize } from '@carbon/react/icons';
import { Cascade, ProductiveCard, SidePanel, pkg } from '@carbon/ibm-products';
import { useDispatch, useSelector } from 'react-redux';
import { MultiStepTearsheetWide, TearsheetNarrow, TearsheetWide } from '../../../Kanban/component-playground/components';
import { addTask, setIsMulti, setOpenTask } from '../../../../actions/task';
import { Editor } from 'primereact/editor';
import { sendMessage, setLoadingMessage } from '../../../../actions/kalkiai';
import Showdown from 'showdown';
import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from "file-saver";
import AWS from 'aws-sdk';
import { Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

AWS.config.update({ 
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

pkg.component.ProductiveCard = true;
pkg.component.SidePanel = true;
pkg.component.Cascade = true;

const ChatScreen = () => {
  const showdown = new Showdown.Converter();
  const { user } = useSelector((state) => state.auth);
  const profile = useSelector((state)=>state.profile);
  const createTaskTemplate = {
    "user": {
      "first_name": profile?.first_name,
      "last_name": profile?.last_name,
      "email": profile?.verification_status?.email?.value,
      "mobile": profile?.verification_status?.mobile?.value,
      "upi": profile?.verification_status?.upi?.value,
      "adhar": profile?.verification_status?.adhar?.value,
      "terms_conditions":  profile?.terms_conditions,
      "avatar": profile?.avatar,
      "date": profile?.date
    },
    "name": "",
    "description": "",
    "assigned": [
        {
          "user": profile?.user,
          "status": "To Do",
          "isVolunteer": false,
          "rating": profile?.rating,
      }
    ],
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
    }
    },
    "cost": {
        "estimated": 384,
        "actual": 416
    },
    "org": profile?.org,
    "location": "Online",
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
  };
  const { currentSession, loading } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! I am an assistant for your idea implementation? You can generate tasks, create plans, and much more. How can I help you today?"}
  ]); 
  const [ idea, setIdea ] = useState(false);
  const [ quillInstance, setQuillInstance ] = useState(false);
  const { tasks } = useSelector((state) => state.task);
  const [cards, setCards] = useState(tasks);
  const [ taskPath , setTaskPath ] = useState(null);
  const [createdTask, setCreatedTask] = useState({});
  const [messagesComponent, setMessagesComponent] = useState();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState();
  const [narrowTearsheetOpen, setNarrowTearsheetOpen] = useState(false);
  const [wideTearsheetOpen, setWideTearsheetOpen] = useState(false);
  const [multiStepTearsheetOpen, setMultiStepTearsheetOpen] = useState(false);
  const dispatch = useDispatch();
  const exportPdf = (event, path=null) => {
    // we pass the delta object to the generatePdf function of the pdfExporter
    // be sure to AWAIT the result, because it returns a Promise
    // it will resolve to a Blob of the PDF document
    // if(idea===""){
    //     setIdea(
    //       showdown.makeHtml(
    //         await messages.slice(-4)[0].content
    //       )
    //     )
    //   }
    
    // console.log("event value: ", event);
    // const quill  = new Quill();
    // quill.container.firstChild.innerHTML = event
    // const delta = quill.getContents();
    // console.log("This is the delta: ",delta);
    // pdfExporter.generatePdf(delta).then((blob) => {
    //   console.log("This is blob: ",blob);
    //   saveAs(blob, "pdf-export.pdf");
    // });

    // let component = <div dangerouslySetInnerHTML={{__html: event}} />;
    // html2canvas(component).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgData, 'PNG', 0, 0);
    //   pdf.save("download.pdf");
    // });
    // console.log("This is event: ",event);
    pdfExporter.generatePdf(event.editor.delta).then((blob) => {
      // console.log("This is blob: ",blob);
      if (path) {
        const s3 = new AWS.S3({ params: { Bucket: 'kalkinso.com' } });
        const params = {
          Bucket: 'kalkinso.com',
          Key: path,
          Body: blob,
        };
        s3.putObject(params).promise().then((res)=>{
          // console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}: ${res}`);
        }).catch((reason)=>{
          // console.log(reason)
        });
      } else {
        saveAs(blob, "pdf-export.pdf");
      }
    });

    // we use saveAs from the file-saver package to download the blob
  };
  // const [pdf, setPdf] = useState(()=>exportPdf());
  useEffect(()=>{
    if(window.location.hash.toLowerCase().includes('#/home')
      &&window.location.hash.toLowerCase().replace('#/home','')
    &&window.location.hash.toLowerCase().replace('#/home','')!=='/create'
    &&window.location.hash.toLowerCase().replace('#/home','')!==''){
      setTaskPath(window.location.hash.toLowerCase().replace('#/home/',''));
    } else {
      setTaskPath(null);
    }
  },[window.location.hash]);

  useEffect(() => {
    // console.log("This is task path sidebar chat: ",taskPath);
  }, [taskPath]);

  useEffect(() => {
    // console.log("This is changed messages: ",messages);
    setMessagesComponent(messages.map((message, index) => (
      <>
      <Tile
        key={`${index}-${message.role}`}
        className={`chat-message ${message.role}-body-bubble`}
      >
            {message.content}
        {message.actions && (
          // <div className="actions" key={`${index}-${message.role}-chat-bubble-div`} style={{
          //   display: 'grid',
          //   alignItems: 'flex-end',
          //   gridGap: '0.5rem',
          //   gridTemplateColumns: '1fr 1fr 1fr 1fr',
          //   marginTop: '1rem'
          //   }}>
          <ButtonSet style={{margin:"1rem"}}>
            {message.actions.map((action, index) => (
              <Button kind={action.kind} key={index} size='small' onClick={()=>action.onClick(idea)}>{action.label}</Button>
            ))}
          </ButtonSet>
          // </div>
        )}
      </Tile>
      {message.cards && (
          <div className="actions" key={`${index}-${message.role}-prod-card`} style={{
            display: 'grid',
            alignItems: 'flex-end',
            gridGap: '0.5rem',
            gridTemplateColumns: '1fr',
            marginTop: '1rem'
            }}>
          {message.cards.map((card, index) => {
            if (card?.task_list){
              return <ExpandableTile tileExpandedIconText="Collapse">
                <TileAboveTheFoldContent>
                <ProductiveCard
                  key={`${index}-${message.role}-prod-card-body`}
                  // onClick={()=>handleTaskOpen('single')}
                  label={card.project_name}
                  actionIcons={[
                    {
                      id: '1',
                      icon: () => (
                        <Checkmark
                          iconDescription={'Create'}
                          kind={'primary'}
                          size="sm"
                          theme="dark"
                        />
                      ),
                      iconDescription: "Create",
                      disabled: createdTask[`${index}-${message.role}-prod-card-body`],
                      onClick: () => {
                        let newTask = {...createTaskTemplate};
                        let tempCreatedTask = {...createdTask};
                        tempCreatedTask[`${index}-${message.role}-prod-card-body`] = true
                        newTask.name = card.project_name;
                        newTask.short_description = card.project_description;
                        newTask.description = card.standard_operating_procedures;
                        // newTask.terms_conditions = card.project_terms_conditions;
                        newTask.time.estimated = [
                                                      {
                                                          "user": profile?.user,
                                                          "value": card.project_total_estimated_time,
                                                      }
                                                  ];
                        newTask.cost.estimated = card.project_total_estimated_cost;
                        newTask.cost.actual = card.project_total_estimated_cost;
                        newTask.subTasks = card.task_list.map((task) => {
                          tempCreatedTask[`${index}-${message.role}-prod-task-body`] = true
                          return {
                            ...createTaskTemplate,
                            name: task.sub_task,
                            description: task.standard_operating_procedures,
                            time: {
                              estimated: [
                                {
                                  "user": user?._id,
                                  "value": task.estimated_time,
                                }
                              ]
                            },
                            cost: {
                              estimated: task.estimated_cost,
                              actual: task.estimated_cost
                            },
                            short_description: task.description,
                            // terms_conditions: task.terms_conditions
                          }
                        });
                        dispatch(addTask(newTask, taskPath?.split('&&')?.splice(-1)?taskPath?.split('&&')?.splice(-1)[0]:null, taskPath));
                        setCreatedTask(tempCreatedTask);
                      }
                    },
                  ]}
                  actionsPlacement="top"
                  // onClick={()=>handleTaskOpen('single')}
                  description={card.project_description}
                  // overflowActions={}
                  // onPrimaryButtonClick={() => handleTaskOpen('single')}
                  // primaryButtonText={"View"}
                  // secondaryButtonText={"Start"}
                  // onSecondaryButtonClick={() => handleTaskOpen('multi')}
                  // title={cards[card.index].name}
                >
                  <Grid>
                    <Column lg={2}>Cost Estimation</Column>
                    <Column lg={2}>₹ {card.project_total_estimated_cost}</Column>
                  </Grid>
                  <Grid>
                    <Column lg={2}>Time Estimation</Column>
                    <Column lg={2}>{card.project_total_estimated_time} {`hour(s)`}</Column>
                  </Grid>
                  <Grid>
                    <Column lg={2}>Estimated Earning Per Month</Column>
                    <Column lg={2}>₹ {card.project_total_estimated_earning}</Column>
                  </Grid>
                </ProductiveCard>
                </TileAboveTheFoldContent>
                <TileBelowTheFoldContent>
                  {card.task_list.map((task, index) => {
                    return <ProductiveCard
                    key={`${index}-${message.role}-prod-task-body`}
                    // onClick={()=>handleTaskOpen('single')}
                    label={task.sub_task}
                    actionIcons={[
                      {
                        id: '1',
                        icon: () => (
                          <Checkmark
                            iconDescription={'Create'}
                            kind={'primary'}
                            size="sm"
                            theme="dark"
                          />
                        ),
                        iconDescription: "Create",
                        diabled: createdTask[`${index}-${message.role}-prod-task-body`],
                        onClick: () => {
                          let newTask = {...createTaskTemplate};
                          let tempCreatedTask = {...createdTask};
                          if (tempCreatedTask[`${index}-${message.role}-prod-card-body`]) {
                            newTask = {
                              ...createTaskTemplate,
                              name: task.sub_task,
                              description: task.standard_operating_procedures,
                              time: {
                                estimated: [
                                  {
                                    "user": user?._id,
                                    "value": task.estimated_time,
                                  }
                                ]
                              },
                              cost: {
                                estimated: task.estimated_cost,
                                actual: task.estimated_cost
                              },
                              parentTasks: [card?._id],
                              short_description: task.description,
                              // terms_conditions: task.terms_conditions
                            };
                            dispatch(addTask(newTask, card?._id, taskPath?taskPath+'&&'+card?._id:card?._id));
                            setCreatedTask({...tempCreatedTask, [`${index}-${message.role}-prod-task-body`]: true});
                          }
                          tempCreatedTask[`${index}-${message.role}-prod-card-body`] = true;
                          newTask.name = card.project_name;
                          newTask.short_description = card.project_description;
                          newTask.description = card.standard_operating_procedures;
                          // newTask.terms_conditions = card.project_terms_conditions;
                          newTask.time.estimated = [
                                                        {
                                                            "user": user?._id,
                                                            "value": card.project_total_estimated_time,
                                                        }
                                                    ];
                          newTask.cost.estimated = card.project_total_estimated_cost;
                          newTask.cost.actual = card.project_total_estimated_cost;
                          tempCreatedTask[`${index}-${message.role}-prod-task-body`] = true;
                          newTask.subTasks = [
                            {
                              ...createTaskTemplate,
                              name: task.sub_task,
                              description: task.standard_operating_procedures,
                              time: {
                                estimated: [
                                  {
                                    "user": user?._id,
                                    "value": task.estimated_time,
                                  }
                                ]
                              },
                              cost: {
                                estimated: task.estimated_cost,
                                actual: task.estimated_cost
                              },
                              short_description: task.description,
                              // terms_conditions: task.terms_conditions
                            }
                          ];
                          dispatch(addTask(newTask, taskPath?.split('&&')?.splice(-1)?taskPath?.split('&&')?.splice(-1)[0]:null, taskPath));
                          setCreatedTask(tempCreatedTask);
                        }
                      },
                    ]}
                    actionsPlacement="top"
                    // onClick={()=>handleTaskOpen('single')}
                    description={task.description}
                    // overflowActions={}
                    // onPrimaryButtonClick={() => handleTaskOpen('single')}
                    // primaryButtonText={"View"}
                    // secondaryButtonText={"Start"}
                    // onSecondaryButtonClick={() => handleTaskOpen('multi')}
                    // title={cards[card.index].name}
                  >
                    <Grid>
                      <Column lg={2}>Cost Estimation</Column>
                      <Column lg={2}>₹ {task.estimated_cost}</Column>
                    </Grid>
                    <Grid>
                      <Column lg={2}>Time Estimation</Column>
                      <Column lg={2}>{task.estimated_time} {`hour(s)`}</Column>
                    </Grid>
                  </ProductiveCard>
                  })}
                </TileBelowTheFoldContent>
              </ExpandableTile>
            }
            else {
            return (
                <ProductiveCard
                  key={`${index}-${message.role}-prod-card-body`}
                  // onClick={()=>handleTaskOpen('single')}
                  label={card.project_name}
                  actionIcons={[
                    {
                      id: '1',
                      icon: () => (
                        <Checkmark
                          iconDescription={'Create'}
                          kind={'primary'}
                          size="sm"
                          theme="dark"
                        />
                      ),
                      iconDescription: "Create",
                      disabled: createdTask[`${index}-${message.role}-prod-card-body`],
                      onClick: () => {
                        let newTask = {...createTaskTemplate};
                        let tempCreatedTask = {...createdTask};
                        tempCreatedTask[`${index}-${message.role}-prod-card-body`] = true
                        newTask.name = card.project_name;
                        newTask.short_description = card.project_description;
                        newTask.description = card.standard_operating_procedures;
                        // newTask.terms_conditions = card.project_terms_conditions;
                        newTask.time.estimated = [
                                                      {
                                                          "user": user?._id,
                                                          "value": card.project_total_estimated_time,
                                                      }
                                                  ];
                        newTask.cost.estimated = card.project_total_estimated_cost;
                        newTask.cost.actual = card.project_total_estimated_cost;
                        if(card?.task_list?.length>0){
                          newTask.subTasks = card.task_list.map((task) => {
                            tempCreatedTask[`${index}-${message.role}-prod-task-body`] = true
                            return {
                              ...createTaskTemplate,
                              name: task.sub_task,
                              description: task.standard_operating_procedures,
                              time: {
                                estimated: [
                                  {
                                    "user": user?._id,
                                    "value": task.estimated_time,
                                  }
                                ]
                              },
                              cost: {
                                estimated: task.estimated_cost,
                                actual: task.estimated_cost
                              },
                              short_description: task.description,
                              // terms_conditions: task.terms_conditions
                            }
                          });
                        }
                        dispatch(addTask(newTask, taskPath?.split('&&')?.splice(-1)?taskPath?.split('&&')?.splice(-1)[0]:null, taskPath));
                        setCreatedTask(tempCreatedTask);
                      }
                    },
                  ]}
                  actionsPlacement="top"
                  // onClick={()=>handleTaskOpen('single')}
                  description={card.project_description}
                  // overflowActions={}
                  // onPrimaryButtonClick={() => handleTaskOpen('single')}
                  // primaryButtonText={"View"}
                  // secondaryButtonText={"Start"}
                  // onSecondaryButtonClick={() => handleTaskOpen('multi')}
                  // title={cards[card.index].name}
                >
                  <Grid>
                    <Column lg={2}>Cost Estimation</Column>
                    <Column lg={2}>₹ {card.project_total_estimated_cost}</Column>
                  </Grid>
                  <Grid>
                    <Column lg={2}>Time Estimation</Column>
                    <Column lg={2}>{card.project_total_estimated_time} {`hour(s)`}</Column>
                  </Grid>
                  <Grid>
                    <Column lg={2}>Estimated Earning Per Month</Column>
                    <Column lg={2}>₹ {card.project_total_estimated_earning}</Column>
                  </Grid>
                </ProductiveCard>
            );}
          })}
          </div>
        )}
      </>
    )))

  //   setMessagesComponent(<MessageList
  //     className='message-list'
  //     lockable={true}
  //     toBottomHeight={'100%'}
  //     dataSource={messages.map((message, index) => {
  //       if(typeof message.content === 'string') {
  //         if(message?.actions){
  //           return {
  //             position: message.role === 'assistant' ? 'left' : 'right',
  //             type: 'text',
  //             title: message.role === 'assistant' ? 'Ease Assistant' : user?.first_name+' '+user?.last_name,
  //             text: <div>
  //               {message.content} <br />
  //               <ButtonSet style={{margin:"1rem"}}>
  //                 {message.actions.map((action, index) => (
  //                   <Button kind={action.kind} key={index} size='small' onClick={()=>action.onClick(idea)}>{action.label}</Button>
  //                 ))}
  //               </ButtonSet>
  //             </div>,
  //             date: new Date().toLocaleTimeString(),
  //           }
  //         } else {
  //           return {
  //             position: message.role === 'assistant' ? 'left' : 'right',
  //             type: 'text',
  //             title: message.role === 'assistant' ? 'Ease Assistant' : user?.first_name+' '+user?.last_name,
  //             text: ReactDOMServer.renderToStaticMarkup(message.content),
  //             date: new Date().toLocaleTimeString(),
  //           }
  //         }
  //     } 
      
  //     })}
  // />)
  },[messages, idea]);

  useEffect(() => {
    setCards(tasks);
  }, [tasks]);

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

  useEffect(() => {
    if (currentSession.slice(-1)[0].role === 'assistant'&&currentSession.length>1) {
    const markdownMatch = /((#{1,6}\s.*|!\[.*\]\(.*\)|\*{1,2}.*\*{1,2}|\[.*\]\(.*\)|\* .*)*.*(#{1,6}\s.*|!\[.*\]\(.*\)|\*{1,2}.*\*{1,2}|\[.*\]\(.*\)|\* .*)+.*(#{1,6}\s.*|!\[.*\]\(.*\)|\*{1,2}.*\*{1,2}|\[.*\]\(.*\)|\* .*)*)+/;
    if(typeof currentSession.slice(-1)[0].content === 'object') {

      setMessages([
        ...messages,
        {
          role: 'assistant',
          content: "Following are the generated ideas",
          cards: [currentSession.slice(-1)[0].content],
        }
      ]);
      return;
    } else {
      setMessages([
        ...messages,
        {
          role: 'assistant',
          content: <Editor value={quillInstance?quillInstance:showdown.makeHtml(currentSession.slice(-1)[0].content)} onLoad={(e)=>{
            if(e){
              setIdea(e)
              setQuillInstance(showdown.makeHtml(currentSession.slice(-1)[0].content))
              e.on('editor-change', (eventName, ...args) => {
                if (eventName === 'text-change') {
                  // args[0] will be delta[1]
                  // console.log("This is delta: ",args[1]);
                } else if (eventName === 'selection-change') {
                  // args[0] will be old range
                  // console.log("This is delta: ",args[0]);
                }
              });
            }
          }} onTextChange={(e) => {
            setQuillInstance(e.htmlValue);
              // setIdea(e.htmlValue);
              // console.log("This is event when text is changed: ",idea);
            }
          } />,
          actions: [{label:"Yes",onClick:(event)=>{
            dispatch(setLoadingMessage(true));
            dispatch(sendMessage({ role: "user", content: quillInstance?quillInstance:(currentSession.slice(-1)[0].content) }, user, profile.user));
            exportPdf(event, `users/${profile.user}/tasks/ideas/${new Date().toISOString()}.pdf`);
            setMessages([...messages, 
              {
                role: 'assistant',
                content: <Editor value={quillInstance?quillInstance:showdown.makeHtml(currentSession.slice(-1)[0].content)} onLoad={(e)=>{
                  if(e){
                    setIdea(e)
                    setQuillInstance(showdown.makeHtml(currentSession.slice(-1)[0].content))
                  }
                }} showHeader={false} readOnly />,
                actions: [{label:"Download PDF",onClick:(event)=>exportPdf(event, null), kind:"secondary"}],
              },
              { role: "user", content: "Yes" }
            ]);
          }, kind:"secondary"}, 
          {label:"Retry",onClick:()=>{
            dispatch(setLoadingMessage(true));
            dispatch(sendMessage(`I am not happy with the following idea please make some changes: ${idea}`, user, profile.user));
            setMessages([...messages, { role: "user", content: "Retry" }]);
          }, kind:"primary"}],
        }
      ]);
      // if (currentSession.slice(-1)[0].content.match(markdownMatch)) {
      //   setIdea(showdown.makeHtml(currentSession.slice(-1)[0].content));
      // }
    return;
    }
  }
  }, [currentSession]);

  const actions = {
    setSidePanelOpen,
    setNarrowTearsheetOpen,
    setWideTearsheetOpen,
    setComponentConfig,
    setCards,
    setCardToEdit,
  };

  const handleTaskOpen = (isMulti) => {
    if(isMulti==='multi') {
    dispatch(setIsMulti(true));
    dispatch(setOpenTask(true));
    } else {
      dispatch(setIsMulti(false));
      dispatch(setOpenTask(true));
    }
  };

  const handleSendMessage = (inputMessage) => {
    if (inputMessage.trim()) {
      dispatch(setLoadingMessage(true));
      let promptMessage = { role: "user", content: inputMessage }
      dispatch(sendMessage(inputMessage, user, profile.user));
      setMessages([...messages, promptMessage]);
      // Simulate a bot response
      // setTimeout(() => {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { role: "bot", content: <Editor defaultValue={"Temp Text"} onTextChange={(e) => {}} />, actions: [{label:"Yes",onClick:()=>{}, kind:"secondary"}, {label:"No",onClick:()=>{}, kind:"primary"}] },
      //   ]);
      // }, 1000);
    }
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
      <div style={{ width: '100%', marginTop: '20px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: 'white' }}>
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

  return (
    <>
    <Grid className="chat-screen" style={{height: '75vh'}}>
      {/* <Row className="chat-header" key={"row-ease-header"}>
        <Column lg={14} style={{
                  display: 'grid',
                  alignItems: 'flex-end',
                  gridGap: '0.5rem',
                  gridTemplateColumns: '3fr 1fr',
                  marginTop: '1rem'
                  }}>
          <h4>Ease Assistant</h4><Maximize onClick={()=>alert("clicked")} style={{marginLeft:"5rem", marginBottom:"1rem", cursor:"pointer"}} size={15} />
        </Column>
      </Row> */}
      <Row className="chat-body" key={"row-chat-body"}>
        <Loading active={loading} />
        <Column>
          {messagesComponent}
        </Column>
      </Row>
      <UserInputForm onSendMessage={handleSendMessage} />
    </Grid>
    <MultiStepTearsheetWide
        cards={cards}
        isOpen={multiStepTearsheetOpen}
        setIsOpen={setMultiStepTearsheetOpen}
        componentConfig={componentConfig.createTearsheet}
        actions={actions}
      />
      {cardToEdit !== undefined && (
        <SidePanel
          data={cards[cardToEdit]}
          actions={actions}
          index={cardToEdit}
          cards={cards}
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
    </>
  );
};

export default ChatScreen;