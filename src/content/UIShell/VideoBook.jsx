import { Loading, TextInput } from '@carbon/react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Pusher from 'pusher-js';

import SlateTranscriptEditor from '@bbc/react-transcript-editor';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../actions/alert';
import axios from 'axios';
import SOLIEO_DATA from './sample-data/soleio-dpe.json';
import { save } from '../../actions/kits';
import { Button } from 'carbon-components-react';


const VideoBook = (props) => {
    // Declare a new state variable, which we'll call "count"
    const [jsonData, setJsonData] = useState(SOLIEO_DATA);
    const [title, setTitle] = useState('Video Book');
    const dispatch = useDispatch();
    const [mediaUrl, setMediaUrl] = useState('');
    const { user } = useSelector((state) => state.profile);
    const [status, setStatus] = useState('started');
    const [interimResults, setInterimResults] = useState({});
    const [ prompt, setPrompt ] = useState('');
    const [ component, setComponent ] = useState(null);
    useEffect(() => {
      let selectedTool = JSON.parse(localStorage.getItem("selectedTool"));
      if(selectedTool&&selectedTool.name==="videobook-assistant"&&Object.keys(selectedTool.selectedEntry).length>0&&selectedTool.selectedEntry?.children?.entries?.length>0){
        const mp4File = selectedTool.selectedEntry.children.entries.find((entry) => entry.fileType === 'mp4');
        const jsonFile = selectedTool.selectedEntry.children.entries.find((entry) => entry.fileType === 'json');
        if(mp4File&&jsonFile){
          axios.get(jsonFile.signedUrl).then((res) => {
            setJsonData(res.data);
            setMediaUrl(mp4File.signedUrl);
            setTitle(selectedTool.selectedEntry.title);
            setComponent(true);
          }).catch((err) => {
            setComponent(null);
          });
        }
      } else if (selectedTool&&selectedTool.name==="videobook-assistant"&&Object.keys(selectedTool.selectedEntry).length>0&&selectedTool.selectedEntry?.children?.entries?.length===0){
        setComponent("loading");
      }
    }, []);
    useEffect(() => {
        // Initialize Pusher
        const pusher = new Pusher('14bbfc475d91b9f07a76', {
            cluster: 'ap2'
        });
    
        // Subscribe to the channel
        const channel = pusher.subscribe('kalkinso-bucaudio');
    
        // Listen for job-started event
        channel.bind('job-started', (data) => {
          if(data.user !== user) {
          setComponent('loading');
          setStatus(data.message);
          }
        });
    
        // Listen for job-completed event
        channel.bind('job-completed', (data) => {
            // setJsonData(data.json_signed);
            if(data.user !== user) {
            axios.get(data.json_signed).then((res) => {
                if(res.data.blocks.length === 0) {
                  setJsonData(null);
                } else {
                  setJsonData(res.data);
                }
                setMediaUrl(data.signedUrl);
                setComponent(true);
            }).catch((err) => {
                setComponent(null);
            });
          }
        });

        // Listen for job-completed event
        channel.bind('job-running', (data) => {
          if(data.user !== user) {
            setComponent('loading');
            setStatus(data.message);
          }
        });
    
        // Listen for job-failed event
        channel.bind('job-failed', (data) => {
          if(data.user !== user) {
          setComponent(null)
          dispatch(setAlert("Something Went Wrong", 'error'));
          }
        });
    
        // Cleanup on component unmount
        return () => {
          pusher.unsubscribe('kalkinso-bucaudio');
        };
      }, []);
  
    const onSubmit = () => {
        axios.post('/api/kalkiai/audio_video', JSON.stringify({ prompt: prompt, video: 'true' }), {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            dispatch(setAlert("Audio Book Prompt Submitted", 'success'));
            // setComponent('loading');
        }).catch((err) => {
            setComponent(null);
            dispatch(setAlert("Something Went Wrong", 'error'));
        });
    }

    const handleDownloadMedia = () => {
      if (!mediaUrl) {
        alert("Media file is not available.");
        return;
      }
  
      // Create a download link for the media file
      const link = document.createElement("a");
      link.href = mediaUrl;
      link.download = mediaUrl.split("/").pop() || "media-file";
      link.click();
    };
  
    return (
      <>
        {component?(component==='loading'?<><Loading withOverlay={true} description={status} />{status}</>:<><Button
        onClick={handleDownloadMedia}
        kind='primary'
        size='sm'
        style={{
          position: "absolute",
          top: "10rem",
          zIndex: "100",
          right: "4rem",
        }}
      >
        Download
      </Button><SlateTranscriptEditor    
            mediaUrl={mediaUrl}
            transcriptData={jsonData}
            title={title}
            autoPlay={false}
            isEditable={true}
            spellCheck={true}
            sttJsonType="draftjs"
          /></>):<TextInput id="prompt" labelText="Give Audio Book Prompt" value={prompt} onKeyDown={(e)=>{
        if(e.key === 'Enter') {
            onSubmit();
        }
    }} onChange={(e)=>{setPrompt(e.target.value); console.log(e.target.value)}} />}
      </>
    );
  };

export default VideoBook;