import React, { useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { buildPathToTree } from '../utils';
import { TreeView, TreeNode, Tile, ButtonSet, IconButton, ProgressBar } from '@carbon/react';
import { Close, Download, Upload } from '@carbon/react/icons';
import { setLoading } from '../../../actions/auth';
import { addFile, getSelectedTasks, save } from '../../../actions/kits';
import { useDispatch, useSelector } from 'react-redux';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

AWS.config.update({
    accessKeyId: "AKIA6GBMDGBC6SGUYGUC",
    secretAccessKey: "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",
});

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
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const profile = useSelector((state) => state.profile);
  const [activeState, setActiveState] = useState(false);
  const [ uploadState, setUploadState ] = useState('idle');
  const [ progress, setProgress ] = useState(null);
  const dispatch = useDispatch();
  const files = buildPathToTree(acceptedFiles.map(file => file.path));
  let totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
  const [component, setComponent] = useState(<></>);
  let helperText = uploadState==='uploading'&&progress!==null ? `${progress.toFixed(1)}MB of ${totalSize}MB` : 'Uploading assets...';
  if (progress!==null&&(progress >= totalSize)) {
    helperText = 'Done';
    totalSize = 0;
  }
  const handleUpload = (files, item) => {
    const s3 = new S3({
        params: { Bucket: 'kalkinso.com' },
        region: 'ap-south-1',
    });
    setUploadState('uploading');
    files.forEach((file) => {
        const params = {
            Bucket: 'kalkinso.com',
            Key: `${file.path[0]==='/'?item.id.slice(0,-1):item.id}${file.path}`,
            Body: file,
          };
          s3.putObject(params).promise().then((res)=>{
            console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}: ${res}`);
            setProgress(progress?progress + file.size:file.size);
          }).catch((reason)=>{
            console.log(reason)
          })
    });
    if(profile?.user){
        dispatch(getSelectedTasks("kalkinso.com",`users/${profile.user}/tasks`, false));
        setActiveState(false);
      }
  };

  useEffect(() => {
    if(acceptedFiles.length>0){
        setActiveState(true);
    } else {
        setActiveState(false);
    }
    console.log('acceptedFiles: ', acceptedFiles);
  }, [acceptedFiles]);

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
                                <ProgressBar value={uploadState==='uploading' ? progress : null} max={totalSize} status={progress === totalSize ? 'finished' : 'active'} label="Uploading data" helperText={helperText} />
                            </p>
                        )}
              </aside>)}
            </section>
    );
    } else {
        setComponent(<></>);
    }
    console.log('path in dropzone: ', path);
  }, [path, activeState, uploadState]);

  return component;
}