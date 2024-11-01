import React, { useEffect, useState } from 'react';
import { Tag, Accordion, AccordionItem, FileUploaderDropContainer, TreeNode, TreeView, IconButton, Column, Grid } from '@carbon/react';
import PropTypes from 'prop-types';
import { NoDataEmptyState } from '@carbon/ibm-products';
import { AddSelectMetaPanel } from '@carbon/ibm-products/lib/components/AddSelect/AddSelectMetaPanel';
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import "./AddSelectSidebar.scss";
import CodeEditor from './CodeEditor';
import FileUploadWidget from './Widgets/FileUpload';
import BlockNoteEditor from './BlockNoteEditor';
import FigmaEditor from './FigmaEditor';
import { Close, Download, Save } from '@carbon/react/icons';
import { useDispatch, useSelector } from 'react-redux';
import { save } from '../../actions/kits';
import { setLoading } from '../../actions/auth';
// import * as Y from "yjs";
// import { WebrtcProvider } from "y-webrtc";
import { ReactDropzone } from './Widgets/ReactDropzone';
import { buildPathToTree, exportToPDF } from './utils';
import { ButtonSet } from 'carbon-components-react';
import "./MultiPageWordProcessor/MultiPageWordProcessor.css";
import PhotoEditor from './PhotoEditor';
import { setDeleteFile } from '../../actions/task';
import TranscriptEditor from '@bbc/react-transcript-editor';


const blockClass = `home--add-select__sidebar`;
const componentName = 'AddSelectSidebar';

function renderTree({ nodes, replacer, expanded, withIcons = false }) {
  let nodesArray = nodes;
  if (nodes&&replacer) {
    nodesArray = buildPathToTree(nodes.map((node) => {
      return node.id.replace(replacer, '');
    }));
    // console.log("Node Array: ",nodesArray);
  }
  if (!nodesArray) {
    return;
  }
  return nodesArray.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
    <TreeNode
      key={nodeProps.id}
      renderIcon={withIcons ? renderIcon : null}
      isExpanded={expanded ?? isExpanded}
      {...nodeProps}>
      {renderTree({ nodes: children, expanded, withIcons })}
    </TreeNode>
  ));
}

const monacoSupportedFileExtensions = {
  "abap": {"language":"abap"},
  "cls": {"language":"apex"},
  "clj": {"language":"clojure"},
  "coffee": {"language":"coffeescript"},
  "cpp": {"language":"cpp"},
  "cs": {"language":"csharp"},
  "csharp": {"language":"csharp"},
  "c": {"language":"c"},
  "css": {"language":"css"},
  "dockerfile": {"language":"dockerfile"},
  "fsharp": {"language":"fsharp"},
  "go": {"language":"go"},
  "groovy": {"language":"groovy"},
  "hlsl": {"language":"hlsl"},
  "html": {"language":"html"},
  "ini": {"language":"ini"},
  "java": {"language":"java"},
  "javascript": {"language":"javascript"},
  "js": {"language":"javascript"},
  "jsx": {"language":"javascript"},
  "json": {"language":"json"},
  "json5": {"language":"json"},
  "less": {"language":"less"},
  "lua": {"language":"lua"},
  "markdown": {"language":"markdown"},
  "md": {"language":"markdown"},
  "objective-c": {"language":"objective-c"},
  "perl": {"language":"perl"},
  "perl6": {"language":"perl"},
  "php": {"language":"php"},
  "plaintext": {"language":"plaintext"},
  "txt": {"language":"plaintext"},
  "postiats": {"language":"postiats"},
  "powerquery": {"language":"powerquery"},
  "powershell": {"language":"powershell"},
  "pug": {"language":"pug"},
  "python": {"language":"python"},
  "py": {"language":"python"},
  "r": {"language":"r"},
  "razor": {"language":"razor"},
  "ruby": {"language":"ruby"},
  "rust": {"language":"rust"},
  "scss": {"language":"scss"},
  "shaderlab": {"language":"shaderlab"},
  "shell": {"language":"shell"},
  "sh": {"language":"shell"},
  "sol": {"language":"solidity"},
  "sql": {"language":"sql"},
  "st": {"language":"smalltalk"},
  "swift": {"language":"swift"},
  "typescript": {"language":"typescript"},
  "ts": {"language":"typescript"},
  "vb": {"language":"vb"},
  "xml": {"language":"xml"},
  "yaml": {"language":"yaml"},
  "yml": {"language":"yaml"},
  "default": {"language":"plaintext"}
};


const AddSelectSidebar = ({
  appliedModifiers,
  closeIconDescription,
  displayMetalPanel,
  illustrationTheme,
  influencerTitle,
  items,
  metaPanelTitle,
  modifiers,
  pathExternal,
  multiSelection,
  setMultiSelection,
  noSelectionDescription,
  noSelectionTitle,
  setDisplayMetaPanel,
}) => {
  const hasModifiers = modifiers?.options?.length > 0;
  const hasSelections = multiSelection.length > 0;
  const [ isChanged, setIsChanged ] = useState(false);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const { file_context } = useSelector((state)=>state.task.kanban);
  const getNewItem = (item) => {
    const { meta, icon, avatar, ...newItem } = item;
    return newItem;
  };

  const sidebarItems = multiSelection.map((selectionId) => {
    if (Array.isArray(items)) {
      const selectedItem = items.find((item) => item.id === selectionId);
      return getNewItem(selectedItem);
    }
    return getNewItem(items[selectionId]);
  });

  const getTitle = (item) => (
    <div className={`${blockClass}-accordion-title`}>
      <div className={`${blockClass}-selected-item`}>
        <p className={`${blockClass}-selected-item-title`}>
          Details
        </p>
        <p className={`${blockClass}-selected-item-subtitle`}>
          {item.subtitle}
        </p>
      </div>
      {hasModifiers && (
        <div>
          {appliedModifiers.find((modifier) => modifier.id === item.id)[
            modifiers.id
          ]}
        </div>
      )}
    </div>
  );

  document.onkeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s" && isChanged && file_context?.id && content) {
          event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
          dispatch(setLoading(true));
          dispatch(save(
            'kalkinso.com',
            file_context.id,
            JSON.stringify(content)
          ));
          setIsChanged(false);
          setContent(null);
      }
    }

  const renderFile = (item) => {
    // const doc = new Y.Doc();
    const files = [{filename: item.title, value: item.signedUrl}];
    if(!item?.signedUrl){
      return <></>;
    }

    if ([ 'mp4', 'webm', 'ogg', 'mov', 'avi', 'flv', 'wmv', 'mkv', 'mpg', 'mpeg', '3gp', '3g2', 'm4v', 'f4v', 'f4p', 'f4a', 'f4b', 'mp3', 'wav' ].includes(item.fileType)) {
      return <TranscriptEditor    
                mediaUrl={item.signedUrl}
              />;
    }

    if (item.fileType === 'txt' || (item.fileType === 'pdf'&&!item.title.includes("view.pdf"))) {
      // const provider = new WebrtcProvider(item.id, doc); // setup a yjs provider (explained below)
      return <div className='word-processor'>
      <BlockNoteEditor 
      // provider={provider} 
      // doc={doc}
      className="page"
      setContent={
        (content)=>setContent(content)} 
      initialContent={
        item.signedUrl
      }
      setIsChanged={setIsChanged}
      onKeyDown = {()=>dispatch(setDeleteFile(item))}
      item_id={item.id}
      bucket="kalkinso.com" 
      /></div>;
      // return <MultiPageWordProcessor
      //   style={{marginTop:"2rem", marginBottom: "2rem"}} 
      //   setContent={
      //     (content)=>setContent(content)} 
      //   initialContent={
      //     item.signedUrl
      //   }
      //   item_id={item.id}
      //   bucket="kalkinso.com" 
      // />
    }
    if (item.fileType === 'png' || item.fileType === 'jpg' || item.fileType === 'jpeg' || item.fileType === 'webp') {
      // return <FigmaEditor image_uri={item.signedUrl} title={item.title}  usageStatistics={false} style={{width:"auto", marginTop:"2rem", marginBottom: "2rem"}} />;
      return <PhotoEditor image_uri={item.signedUrl} title={item.title} closeImgEditor={()=>{
                  setMultiSelection(multiSelection.filter((item_id)=>item_id!==item.id))
                }}
                onKeyDown = {()=>dispatch(setDeleteFile(item))}
              usageStatistics={false} className='page' style={{width:"100%", height:"80vh"}} />;
    }
    if (monacoSupportedFileExtensions.hasOwnProperty(item.fileType)) {
      return <CodeEditor 
                file={files} 
                setContent={
                    (content)=>setContent(content)
                  }  
                setIsChanged={setIsChanged}
                onKeyDown = {()=>dispatch(setDeleteFile(item))}
                item_id={item.id}
                className="page" 
                style={{height: "80vh", width: "96%", marginTop:"2rem", marginBottom: "2rem"}} 
              />;
    } else {
      return <div className='page'>
              <FileViewer
              style={{height: "80vh", width: "100%", maxWidth:"50vw", marginTop:"2rem", marginBottom: "2rem"}}
              fileType={item.fileType}
              filePath={item.signedUrl}
              errorComponent={CustomErrorComponent}
              onError={()=>{console.log("Error in reading file!")}}/>
              </div>;
    }
    
  }

  if (Object.keys(displayMetalPanel).length !== 0) {
    return (
      <AddSelectMetaPanel
        closeIconDescription={closeIconDescription}
        meta={displayMetalPanel.meta}
        setDisplayMetaPanel={setDisplayMetaPanel}
        title={metaPanelTitle}
      />
    );
  }

  return (
    <div className={`${blockClass} word-processor`}>
      <div className={`${blockClass}-header`}>
        <p className={`${blockClass}-title`}>{influencerTitle}</p>
        {/* <Tag type="gray" size="sm">
          {multiSelection.length}
        </Tag> */}
      </div>
      {hasSelections ? (
        <Accordion align="start">
          {sidebarItems.map((item, index) => (
            <>
            {
              item.title!==item.value&&(
                <AccordionItem title={getTitle(item)} key={item.id}>
                  {Object.keys(item).map((key) => {
                    if (key === 'signedUrl' || key === 'id' || key === 'value') {
                        return null
                    }
                    return (
                    <div className={`${blockClass}-item`} key={key}>
                      <p className={`${blockClass}-item-header`}>{key}</p>
                      <p className={`${blockClass}-item-body`}>{item[key]}</p>
                    </div>
                  )})}
                </AccordionItem>
              )
            }
            {item.signedUrl&&(<>
            {item?.signedUrl&&!(item.fileType === 'png' || item.fileType === 'jpg' || item.fileType === 'jpeg' || item.fileType === 'webp')&&(<IconButton disabled={!isChanged} kind='ghost' title='save' align='bottom-right' onClick={()=>{
                  dispatch(setLoading(true));
                  dispatch(save(
                    'kalkinso.com',
                    item.id,
                    JSON.stringify(content)
                  ));
                  setIsChanged(false);
                  setContent(null);
                }}>
                  <Save />
                </IconButton>)}
                {item?.signedUrl&&(
                  <IconButton kind='ghost' title='save' align='bottom-right' onClick={()=>{
                    if (item.fileType === 'txt') {
                      dispatch(setLoading(true));
                      exportToPDF(content, item.title).then(() => {
                        dispatch(setLoading(false));
                      }).catch((error) => {
                        dispatch(setLoading(false));
                        console.error(error);
                      }).finally(() => {
                        dispatch(setLoading(false));
                      });
                    } else {
                      const aTag = document.createElement("a");
                      aTag.href = item.signedUrl;
                      aTag.download = item.title;
                      document.body.appendChild(aTag);
                      aTag.click();
                      aTag.remove();
                    }
                  }}>
                    <Download />
                  </IconButton>)}
                  {!(item.fileType === 'png' || item.fileType === 'jpg' || item.fileType === 'jpeg' || item.fileType === 'webp')&&(
                    <IconButton kind='ghost' title='close' align='bottom-right' onClick={()=>{
                      setMultiSelection(multiSelection.filter((item_id)=>item_id!==item.id))
                    }}>
                      <Close />
                    </IconButton>)}</>)}
            {item.signedUrl&&renderFile(item)}
            {item.id&&(!item?.signedUrl)&&(
              <ReactDropzone data={true} content={content} setContent={setContent} multiSelection={multiSelection} setMultiSelection={setMultiSelection} renderTreeFiles={renderTree} items={items} item={item} path={pathExternal} />
            )}
            </>
          ))}
        </Accordion>
      ) : (
        <div className={`${blockClass}-body`} style={{width: "100%"}}>
          <ReactDropzone data={false} path={pathExternal} />
        </div>
      )}
    </div>
  );
};

AddSelectSidebar.propTypes = {
  appliedModifiers: PropTypes.array,
  closeIconDescription: PropTypes.string,
  displayMetalPanel: PropTypes.object,
  illustrationTheme: PropTypes.oneOf(['light', 'dark']),
  influencerTitle: PropTypes.string,
  items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  metaPanelTitle: PropTypes.string,
  modifiers: PropTypes.object,
  multiSelection: PropTypes.array,
  noSelectionDescription: PropTypes.string,
  noSelectionTitle: PropTypes.string,
  setDisplayMetaPanel: PropTypes.func,
};

AddSelectSidebar.displayName = componentName;

export default AddSelectSidebar;
