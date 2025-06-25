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
  unstable__ChatButton as ChatButton,
  TextArea,
  ButtonSet,
  Loading,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from '@carbon/react';
import './ChatScreen.css';
import { Checkmark, Forum, Maximize } from '@carbon/react/icons';
import FluidTextInput from '@carbon/react/lib/components/FluidTextInput';
import { ClickableTile } from 'carbon-components-react';
import { Cascade, ProductiveCard, SidePanel, pkg } from '@carbon/ibm-products';
import { useDispatch, useSelector } from 'react-redux';
import { MultiStepTearsheetWide, TearsheetNarrow, TearsheetWide } from '../Kanban/component-playground/components';
import { setIsMulti, setOpenTask } from '../../actions/task';
import { Editor } from 'primereact/editor';
import { sendMessage, setLoadingMessage } from '../../actions/kalkiai';
import Showdown from 'showdown';
import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from "file-saver";
pkg.component.ProductiveCard = true;
pkg.component.SidePanel = true;
pkg.component.Cascade = true;

const ChatScreen = (rest) => {
  const showdown = new Showdown.Converter();
  const { user } = useSelector((state) => state.auth);
  const profile = useSelector((state)=>state.profile);
  const { currentSession, loading } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([
    {role: "assistant", content: "Hello there! I am an assistant for your idea implementation? You can generate tasks, create plans, and much more. How can I help you today?"}
  ]); 
  const [ idea, setIdea ] = useState(false);
  const [ quillInstance, setQuillInstance ] = useState(false);
  const { tasks } = useSelector((state) => state.task);
  const [cards, setCards] = useState(tasks);
  const [messagesComponent, setMessagesComponent] = useState();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState();
  const [narrowTearsheetOpen, setNarrowTearsheetOpen] = useState(false);
  const [wideTearsheetOpen, setWideTearsheetOpen] = useState(false);
  const [multiStepTearsheetOpen, setMultiStepTearsheetOpen] = useState(false);
  const dispatch = useDispatch();
  const exportPdf = (event) => {
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
      saveAs(blob, "pdf-export.pdf");
    });

    // we use saveAs from the file-saver package to download the blob
  };
  // const [pdf, setPdf] = useState(()=>exportPdf());
  useEffect(()=>{
    // setPdf(()=>exportPdf(quillInstance));
    // console.log("This is changed idea: ",quillInstance);
    // console.log("This is changed messages: ",messages);
  },[quillInstance]);

  useEffect(() => {
    // setPdf(()=>exportPdf(quillInstance));
    // console.log("This is changed idea: ",idea);
    // console.log("This is changed pdf: ",pdf);
  },[idea])

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
                      onClick: () => setMultiStepTearsheetOpen(true)
                    },
                  ]}
                  actionsPlacement="top"
                  // onClick={()=>handleTaskOpen('single')}
                  description={card.project_description}
                  // overflowActions={}
                  onPrimaryButtonClick={() => handleTaskOpen('single')}
                  // primaryButtonText={"View"}
                  // secondaryButtonText={"Start"}
                  onSecondaryButtonClick={() => handleTaskOpen('multi')}
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
                        onClick: () => setMultiStepTearsheetOpen(true)
                      },
                    ]}
                    actionsPlacement="top"
                    // onClick={()=>handleTaskOpen('single')}
                    description={task.description}
                    // overflowActions={}
                    onPrimaryButtonClick={() => handleTaskOpen('single')}
                    // primaryButtonText={"View"}
                    // secondaryButtonText={"Start"}
                    onSecondaryButtonClick={() => handleTaskOpen('multi')}
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
                      onClick: () => setMultiStepTearsheetOpen(true)
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
          actions: [{label:"Yes",onClick:()=>{
            dispatch(setLoadingMessage(true));
            dispatch(sendMessage({ role: "user", content: quillInstance?quillInstance:(currentSession.slice(-1)[0].content) }, user, profile.user));
            setMessages([...messages, 
              {
                role: 'assistant',
                content: <Editor value={quillInstance?quillInstance:showdown.makeHtml(currentSession.slice(-1)[0].content)} onLoad={(e)=>{
                  if(e){
                    setIdea(e)
                    setQuillInstance(showdown.makeHtml(currentSession.slice(-1)[0].content))
                  }
                }} showHeader={false} readOnly />,
                actions: [{label:"Download PDF",onClick:exportPdf, kind:"secondary"}],
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
      <FluidForm onSubmit={handleSubmit} className="input-form">
          <FluidTextInput
              id="chat-input"
              labelText=""
              placeholder="Type something..."
              value={input}
              onChange={handleChange}
          />
          <Button kind='ghost' type="submit"><Forum size={20}/></Button>
      </FluidForm>
    );
  };

  return (
    <>
    <Grid className="chat-screen" style={{height: '85vh'}} {...rest}>
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