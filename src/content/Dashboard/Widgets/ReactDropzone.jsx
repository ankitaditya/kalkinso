import React, { useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { buildPathToTree } from '../utils';
import { TreeView, TreeNode, Tile, ButtonSet, IconButton, ProgressBar } from '@carbon/react';
import { Close, Download, Upload } from '@carbon/react/icons';
import { setLoading } from '../../../actions/auth';
import { addFile, getSelectedTasks, save } from '../../../actions/kits';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getObjectById } from '../../../utils/redux-cache';
import { setAlert } from '../../../actions/alert';

function renderTree({ nodes, expanded, withIcons = false }) {
    if (!nodes) {
      return;
    }
    return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
      <TreeNode
        key={nodeProps.id}
        renderIcon={withIcons ? renderIcon : null}
        isExpanded={expanded ?? isExpanded}
        {...nodeProps}>
        {renderTree({ nodes: children, expanded, withIcons })}
      </TreeNode>
    ));
  }

export const ReactDropzone = ({path, data, content, setContent, multiSelection, setMultiSelection, renderTreeFiles, items, item}) => {
  const profile = useSelector((state) => state.profile);
  const { entries } = useSelector((state) => state.kits.selectedTask);
  const [activeState, setActiveState] = useState(false);
  const [ uploadState, setUploadState ] = useState('idle');
  const [ progress, setProgress ] = useState(null);
  const dispatch = useDispatch();
  const validateExistence = (file) => {
    if (entries.length>0&&file.path&&path){
      if (getObjectById(entries[0],`${file.path[0]==='/'?Object.values(path)[0]?.id?.slice(0,-1):Object.values(path)[0]?.id}${file.path}`)){
        dispatch(setAlert(`File already exists`, 'error'));
        return { code: 'file-exists', message: 'File already exists'}
      } else {
        return null
      }
    }
  }
  const {acceptedFiles, getRootProps, getInputProps, isDragAccept} = useDropzone({
    validator: validateExistence,
    onDropAccepted: (files) => {
      setActiveState(true);
      setTotalSize(files.reduce((acc, file) => acc + file.size, 0))
    }
  });
  const files = buildPathToTree(acceptedFiles.map(file => file.path));
  const [ helpText, setHelpText ] = useState('Uploading assets...');
  const [ totalSize, setTotalSize ] = useState(acceptedFiles.reduce((acc, file) => acc + file.size, 0));
  const [component, setComponent] = useState(<></>);
  useEffect(()=>{
    if (progress!==null&&(progress >= totalSize)) {
      setHelpText('done');
      setUploadState('idle');
      // setTotalSize(0);
    } else {
      setHelpText(`${progress?progress.toFixed(1):0}MB of ${totalSize}MB`);
    }
  },[progress, uploadState]);
  useEffect(() => {
    // console.log('path in dropzone: ', helpText);
  }, [helpText]);
  const updateProgress = (prog) => {
    setProgress(progress?progress+prog.loaded:prog.loaded);
  };
  useEffect(() => {
    const eventSource = new EventSource("/progress");

    eventSource.onmessage = (event) => {
      const progress = (event.loaded / event.total) * 100;
      updateProgress(progress);
    };
    eventSource.onerror = () => {
      console.error("Error receiving SSE updates");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [uploadState]);
  const handleUpload = (files, item) => {
    setUploadState('uploading');
    setProgress(0);
    files.forEach((file) => {
        if(getObjectById(entries[0],`${file.path[0]==='/'?item?.id?.slice(0,-1):item?.id}${file.path}`)){
          dispatch(setAlert(`${file.path[0]==='/'?item?.id?.slice(0,-1):item?.id}${file.path}: File already exists`, 'warning'));
          setProgress(progress+file.size);
          return { code: 'file-exists', message: 'File already exists'}
        }
        const params = {
          Bucket: 'kalkinso.com',
          Key: `${file.path[0] === '/' ? item.id.slice(0, -1) : item.id}${file.path}`,
          ContentType: file.type,
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('params', JSON.stringify(params));
      
      axios.post('/api/kits/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          updateProgress(progress);
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          dispatch(setAlert('File uploaded!', 'success'));
          dispatch(
              addFile(`${file.path[0] === '/' ? item.id.slice(0, -1) : item.id}${file.path}`)
          );
          // Delay state update for UX
          setTimeout(() => {
              if (profile?.user) {
                  setActiveState(false);
              }
          }, 1000);
        } 
        else {
          dispatch(setAlert('File not uploaded!', 'error'));
        }
      })
      .catch((error) => {
        dispatch(setAlert('File upload failed!', 'error'));
      });
    });
    setUploadState('idle');
    setProgress(null);
  };

  useEffect(() => {
    if(Object.keys(path)[0]?.split('/')?.length>1||data){
        setComponent(
            <section className="container upload-page">
                {!activeState&&data&&(<IconButton disabled={!content} style={{padding:"5px"}}  kind='ghost' title='save' align='right' onClick={()=>{
                    dispatch(setLoading(true));
                    dispatch(save(
                      'kalkinso.com',
                      item.id,
                      content
                    ));
                    setContent(null);
                  }}>
                    <Download />
                </IconButton>)}
              {!activeState&&(<div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                {data?(<>
              <TreeView hideLabel={true}>
                  {renderTreeFiles({nodes:Object.values(items).filter((node)=>node.id.includes(item.id)&&node.signedUrl),replacer:item.id.slice(0,-1) , withIcons:true, expanded:true})}
              </TreeView></>):(<Tile style={{
                        display: 'flex',
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically
                        height: '75vh', // Full viewport height
                        border: '1px solid lightgray', // Optional: Just to show the container
                    }}>
                    <p style={{
                        padding: '20px',
                    }}>
                        Drag 'n' drop some files here, or click to select files
                    </p>
                </Tile>)}
              </div>)}
              {activeState&&(<aside>
                {uploadState==='idle'?(<TreeView label={<ButtonSet>
                                    <IconButton style={{padding:"5px"}}  size='sm' kind='ghost' align='bottom' label='upload' onClick={()=>handleUpload(acceptedFiles,item?item:Object.values(path)[0])}>
                                        <Upload />
                                    </IconButton>
                                    <IconButton style={{padding:"5px", marginLeft:"5px"}} size='sm' kind='ghost' align='bottom' label='Clear' onClick={()=>setActiveState(false)} >
                                        <Close />
                                    </IconButton>
                                </ButtonSet>}>
                    {renderTree({nodes:files, withIcons:true, expanded:true})}
                </TreeView>):(
                            <p style={{
                                padding: '20px',
                            }}>
                                <ProgressBar value={progress} max={totalSize} status={progress === totalSize ? 'finished' : 'active'} label="Uploading data" helperText={helpText} />
                            </p>
                        )}
              </aside>)}
            </section>
    );
    } else {
        setComponent(<></>);
    }
    // console.log('path in dropzone: ', path);
  }, [path, activeState, uploadState, helpText]);

  return component;
}