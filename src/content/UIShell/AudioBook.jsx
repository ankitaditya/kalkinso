import { Loading, TextInput } from '@carbon/react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import SlateTranscriptEditor from '@bbc/react-transcript-editor';
import DEMO_SOLEIO from './sample-data/soleio-dpe.json';

const AudioBook = (props) => {
    // Declare a new state variable, which we'll call "count"
    const [jsonData, setJsonData] = useState({});
    const [mediaUrl, setMediaUrl] = useState('');
    const [interimResults, setInterimResults] = useState({});
    const [ prompt, setPrompt ] = useState('');
    const [ component, setComponent ] = useState(null);
  
    const onSubmit = () => {
        setComponent('loading');
        setTimeout(()=>{
            setJsonData(DEMO_SOLEIO);
            setMediaUrl('https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4');
            setComponent(true);
        }, 2000)
    }
  
    return (
      <>
        {component?(component==='loading'?<Loading withOverlay={true} />:<SlateTranscriptEditor    
            mediaUrl={mediaUrl}
            transcriptData={jsonData}
            title={"Sample Audio"}
            autoPlay={false}
            isEditable={true}
            spellCheck={true}
            sttJsonType="draftjs"
          />):<TextInput id="prompt" labelText="Give Audio Book Prompt" value={prompt} onKeyDown={(e)=>{
        if(e.key === 'Enter') {
            onSubmit();
        }
    }} onChange={(e)=>{setPrompt(e.target.value); console.log(e.target.value)}} />}
      </>
    );
  };

export default AudioBook;