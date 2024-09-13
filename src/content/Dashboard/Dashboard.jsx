import React, { useEffect, useState } from 'react';
import {
    Tile,
    Grid,
    Column,
    Link,
    OverflowMenu,
    OverflowMenuItem,
    IconButton,
    AspectRatio,
    TextInput,
    Layer,
    ExpandableTile,
    TileAboveTheFoldContent,
    TileBelowTheFoldContent,
    Button,
    TextArea,
    ContentSwitcher,
    IconSwitch,
    Loading,
} from '@carbon/react';
import { Chat, View, Code, Copy, Add, TrashCan, Information, Share,Dashboard, Star, Edit, AddComment, Attachment, Folder, Document, FaceActivated, Forum } from '@carbon/icons-react';
import './Dashboard.scss';
import AnalyticsDashboard from './AnalyticsDashboard';
import { ExpressiveCard, UserAvatar, StatusIcon, pkg, NotFoundEmptyState, UserProfileImage } from '@carbon/ibm-products';
import Post from './Post';
import costaPic from '../Kanban/component-playground/_story-assets/costa.jpeg';
import { FluidForm , TreeNode, TreeView } from 'carbon-components-react';
import { useNavigate } from 'react-router-dom';
import ChatScreen from '../UIShell/SidePanelChat/ChatScreen/ChatScreen';
import FluidTextInput from '@carbon/react/lib/components/FluidTextInput';
import CodeEditor from './CodeEditor';
import FigmaEditor from './FigmaEditor';
import MentionComponent from './MentionComponent';
import RichTextEditor from './RichTextEditor';
import JupyterEditor from './JupyterEditor';
import AddSelectBody from './AddSelectBody';
import { normalize, getGlobalFilterValues } from '@carbon/ibm-products/lib/components/AddSelect/add-select-utils';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedTasks } from '../../actions/kits';
pkg.component.UserAvatar = true;
pkg.component.ExpressiveCard = true;
pkg.component.StatusIcon = true;
pkg.component.NotFoundEmptyState = true;


const sampleUser = {
  name: "Jane Smith",
  username: "@janesmith",
  avatar: "https://example.com/avatar2.jpg",
  image: "https://example.com/user-image.jpg",
  email: "jane.smith@example.com"
};

const SocialFeed = () => {
    const { tasks } = useSelector((state) => state.task.kanban);
    const profile = useSelector((state) => state.profile);
    const { selectedTask } = useSelector((state) => state.kits);
    const dispatch = useDispatch();
    const [items, setItems] = useState({});
    useEffect(()=>{
      if(profile?.user){
        dispatch(getSelectedTasks("kalkinso.com",`users/${profile.user}/tasks`));
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
    const contextMenuItemTemplate = (item) => {
      return (
        <div className="p-d-flex p-ai-center p-jc-between" style={{ width: '250px', margin:"0.5rem", cursor:"pointer" }}>
          <span>{item.icon}</span>
          <span style={{marginLeft:"1rem"}}>{item.label}</span>
        </div>
      );
    }
    const [ contextMenuItems, setContextMenuItems ] = useState([
            { label: 'Add', template: contextMenuItemTemplate, 
            items: [
                { label: 'File', command: (e)=>{
                    alert("File clicked");
                },template: contextMenuItemTemplate, icon: <Document /> },
                { label: 'Folder', command: (e)=>{
                    alert("Folder clicked");
                },template: contextMenuItemTemplate, icon: <Folder /> }
            ],
            icon: <Add /> },
            { label: 'Copy', command: (e)=>{
                alert("Copy clicked");
            },template: contextMenuItemTemplate, icon: <Copy /> },
            { label: 'Delete', command: (e)=>{
              alert("Delete clicked");
          },template: contextMenuItemTemplate, icon: <TrashCan /> }
        ]);
      const handleOnSubmit = (selection) => {
        console.log('Selected Items:', selection);
      };
      
      const handleOnClose = () => {
        console.log('Tearsheet closed');
      };

    const globalFilterOpts =
      true && []?.length
        ? getGlobalFilterValues([], normalizedItems)
        : null;

    useEffect(() => {
      if (selectedTask?.entries?.length>0) {
        console.log('Selected Items:', selectedTask);
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
        setAddSelectComponent(<AddSelectBody title="Select Items"
          description="Choose items from the list"
          items={items}
          contextMenuItems={contextMenuItems}
          setContextMenuItems={setContextMenuItems}
          itemsLabel="Tasks"
          globalSearchLabel="Search Items"
          onCloseButtonText="Close"
          onSubmitButtonText="Submit"
          onSubmit={handleOnSubmit}
          onClose={handleOnClose}
          normalizedItems={normalizedItems}
          useNormalizedItems={useNormalizedItems}
          globalFilterOpts={globalFilterOpts}
          defaultModifiers={defaultModifiers}
          open={true}
          multi={false} />);
      }
    }, [selectedTask, items, normalizedItems, useNormalizedItems, globalFilterOpts]);
    return addSelectComponent;
    // (
      // <>
      // {views!==0?<Grid className='component-playground'>
      //   <Column sm={3} md={3} lg={3} style={{marginTop: "15px"}}>
      //   <TreeView label="">
      //     {renderTree({
      //     nodes,
      //     withIcons: true
      //   })}
      //   </TreeView>
      //   </Column>
      //   <Column sm={3} md={3} lg={12} style={{marginTop: "15px"}}>
      //     <Grid>
      //       {/* <Column sm={3} md={3} lg={16}>
      //         <AnalyticsDashboard />
      //       </Column> */}
      //       {/* <Column sm={3} md={3} lg={16} style={{marginTop: "1rem"}}>
      //         <ExpandableTile tileExpandedIconText="Collapse">
      //           <TileAboveTheFoldContent>
      //             <ExpressiveCard style={{padding:"1rem"}} label={`Task 30`} title={"Task Force"} mediaPosition='left' description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} key={"30"} media={<iframe style={{margin:"1rem", boxShadow:"10px 10px 5px lightgray"}} height={"225rem"} width={"225rem"} src={"https://www.youtube.com/embed/vlDzYIIOYmM"} poster={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRX7zmrU5OWn1HyRDHG1z36Eu7rfGQglKn_g&s'} allowFullScreen />} />
      //           </TileAboveTheFoldContent>
      //           <TileBelowTheFoldContent>
      //             <ExpressiveCard title="John Doe" mediaPosition='left' style={{width:"40rem"}} media={<UserProfileImage kind='user' image={costaPic} size='lg' style={{marginTop:'1.5rem'}} initials='JD'/>} description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} />
      //           </TileBelowTheFoldContent>
      //         </ExpandableTile>
      //         <UserInputForm />
      //       </Column> */}
      //       {/* {postings.slice(0,1).map((post) => {
      //         return <Column sm={3} md={3} lg={16} style={{marginTop: "1rem"}}>
      //                 <ExpandableTile tileExpandedIconText="Collapse">
      //                 <TileAboveTheFoldContent>
      //                   Task Force
      //                 </TileAboveTheFoldContent>
      //                 <TileBelowTheFoldContent>
      //                 <ExpandableTile tileExpandedIconText="Collapse">
      //                   <TileAboveTheFoldContent>
      //                     <ExpressiveCard style={{padding:"1rem"}} label={`Task 30`} title={"Task Force"} mediaPosition='left' description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} key={"30"}  />
      //                   </TileAboveTheFoldContent>
      //                   <TileBelowTheFoldContent>
      //                     <ExpressiveCard title="John Doe" mediaPosition='left' style={{width:"40rem"}} media={<UserProfileImage kind='user' image={costaPic} size='lg' style={{marginTop:'1.5rem'}} initials='JD'/>} description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} />
      //                   </TileBelowTheFoldContent>
      //                 </ExpandableTile>
      //                 </TileBelowTheFoldContent>
      //                 </ExpandableTile>
      //                 <UserInputForm />
      //               </Column>
      //       })} */}
      //       <Column sm={3} md={3} lg={16} style={{marginTop: "1rem"}}>
      //       <ContentSwitcher onChange={(e) => {setSelectedBoard(e)}}>
      //         <IconSwitch name={<ExpandableTile tileExpandedIconText="Collapse">
      //                             <TileAboveTheFoldContent>
      //                               <ExpressiveCard style={{padding:"1rem"}} label={`Task 30`} title={"Task Force"} mediaPosition='left' description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} key={"30"}  />
      //                             </TileAboveTheFoldContent>
      //                             <TileBelowTheFoldContent>
      //                               <ExpressiveCard title="John Doe" mediaPosition='left' style={{width:"40rem"}} media={<UserProfileImage kind='user' image={costaPic} size='lg' style={{marginTop:'1.5rem'}} initials='JD'/>} description={"A large public park in New York City, United States.A large public park in New York City, United States.A large public park in New York City, United States."} />
      //                               <UserInputForm />
      //                             </TileBelowTheFoldContent>
      //                           </ExpandableTile>} text="Task Information">
      //           <Document />
      //         </IconSwitch>
      //         <IconSwitch name={<CodeEditor file={[
      //                             {
      //                               "filename": "example1.js",
      //                               "value": "const greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greet('World'));"
      //                             },
      //                             {
      //                               "filename": "example2.json",
      //                               "value": "{\n  \"name\": \"John Doe\",\n  \"age\": 30,\n  \"city\": \"New York\"\n}"
      //                             },
      //                             {
      //                               "filename": "example3.py",
      //                               "value": "def greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('World'))"
      //                             }
      //                           ]} />} text="Workbench Area">
      //           <Code />
      //         </IconSwitch>
      //         <IconSwitch name={<JupyterEditor />} text="Jupyter AI">
      //           <View />
      //         </IconSwitch>
      //         <IconSwitch name={<FigmaEditor usageStatistics={false} style={{width:"auto"}} />} text="Workbench Area">
      //           <Dashboard />
      //         </IconSwitch>
      //         <IconSwitch name={<RichTextEditor />} text="Text Editor">
      //           <Edit />
      //         </IconSwitch>
      //         <IconSwitch name={<ChatScreen />} text="Community">
      //           <Chat />
      //         </IconSwitch>
      //       </ContentSwitcher>
      //       </Column>
      //       <Column sm={3} md={3} lg={16} style={{marginTop: "1rem"}}>
      //         {selectedBoard.name}
      //       </Column>

      //     </Grid>
      //   </Column>
      //   {/* <Column sm={3} md={3} lg={4} style={{marginTop: "15px", position: "fixed", right:"2vw", width:"22vw"}}>
      //     <ChatScreen />
      //   </Column> */}
      // </Grid>:<Tile>
      //       <NotFoundEmptyState 
      //       title="Welcome Ankit Aditya!" 
      //       subtitle={"This page has no information. Please explore and do some activity to view analytics!"} 
      //       illustrationDescription={"No Data Found!"} 
      //       action={{
      //         text: "Explore Tasks",
      //         onClick: () => {
      //           navigate('search');
      //         }
      //       }}
      //       size='lg'
      //       />
      //  </Tile>}
      //  </>
      //  <ChatComponent />
    // );
};

export default SocialFeed;
