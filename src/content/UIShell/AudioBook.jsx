import { TextInput } from '@carbon/react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import  SlateTranscriptEditor  from 'slate-transcript-editor';

const AudioBook = (props) => {
    // Declare a new state variable, which we'll call "count"
    const [jsonData, setJsonData] = useState({});
    const [interimResults, setInterimResults] = useState({});
    const [ prompt, setPrompt ] = useState('');
    const [ component, setComponent ] = useState(<TextInput />);
  
    useEffect(() => {
      props.transcriptInParts &&
        props.transcriptInParts.forEach(
          delayLoop((transcriptPart) => {
            setInterimResults(transcriptPart);
          }, 3000)
        );
    }, []);
  
    // https://travishorn.com/delaying-foreach-iterations-2ebd4b29ad30
    const delayLoop = (fn, delay) => {
      return (x, i) => {
        setTimeout(() => {
          fn(x);
        }, i * delay);
      };
    };
  
    return (
      <>
        <SlateTranscriptEditor
          mediaUrl={text('mediaUrl', DEMO_MEDIA_URL_SOLEIO)}
          handleSaveEditor={action('handleSaveEditor')}
          handleAutoSaveChanges={action('handleAutoSaveChanges')}
          // https://www.npmjs.com/package/@storybook/addon-knobs#select
          autoSaveContentType={select('autoSaveContentType', ['digitalpaperedit', 'slate'], 'digitalpaperedit')} // digitalpaperedit or slate - digitalpaperedit, runs alignement before exporting, slate, is just the raw data.
          transcriptData={jsonData}
          transcriptDataLive={interimResults}
          isEditable={props.isEditable}
          title={props.title}
          showTitle={true}
          showTimecodes={true}
          showSpeakers={true}
        />
      </>
    );
  };

export default AudioBook;