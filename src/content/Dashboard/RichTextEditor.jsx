import React, { useEffect, useRef, useState } from 'react';
import { Editor } from 'primereact/editor';
import axios from 'axios';
import { Toggle } from '@carbon/react';

const RichTextEditor = () => {
    const quillRef = useRef(null);
    const [suggestion, setSuggestion] = useState(''); // Store the suggestion
    const [inputValue, setInputValue] = useState(''); // Track the user's input
    const [autoComplete, setAutoComplete] = useState(false);

    const getSuggestions = async (text) => {
        try {
          const response = await axios.post(
                  'https://api.openai.com/v1/completions',
                  {
                      model: 'gpt-3.5-turbo-instruct', // You can replace this with 'gpt-4' if you have access
                      prompt: text,
                      max_tokens: 50,
                      temperature: 0.7,
                  },
                  {
                      headers: {
                          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                          'Content-Type': 'application/json',
                      },
                  }
              );

            const suggestionText = response.data.choices[0].text.trim();
            if (suggestionText){
              setSuggestion(suggestionText); // Store the suggestion for later use
              const quillEditor = quillRef.current.getQuill();
              const currentPos = quillEditor.getSelection().index;
              quillEditor.insertText(currentPos, suggestionText, {
                color: 'lightgray',
              });
              quillEditor.setSelection(currentPos)
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    // useEffect(()=>{
    //   if(suggestion){
    //     const quillEditor = quillRef.current.getQuill();
    //     const currentPos = quillEditor.getSelection().index;
    //     quillEditor.insertText(currentPos, suggestion, {
    //       color: 'lightgray',
    //     });
    //     quillEditor.setSelection(currentPos)
    //   }
    // },[suggestion])
    useEffect(() => {
      // console.log(inputValue);
    }, [inputValue]);

    return (
        <div style={{ position: 'relative' }}>
            <Editor 
                ref={quillRef} 
                // value={inputValue}
                onTextChange={(e) => {
                  if (e.htmlValue){
                    let textValue = e.htmlValue.replace(/<[^>]+>/g, '');
                    if (suggestion) {
                      textValue = textValue.slice(0, textValue.length-suggestion.length);
                    }
                    setInputValue(textValue);
                  }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault(); // Prevent the default tab behavior
                        if (suggestion) {
                            const quillEditor = quillRef.current.getQuill();
                            const currentPos = quillEditor.getSelection().index;
                            quillEditor.insertText(currentPos-1, suggestion.trim());
                            // const deletePos = currentPos + suggestion.length;
                            // quillEditor.deleteText(deletePos, suggestion.length);
                            setSuggestion(''); // Clear suggestion after inserting
                        }
                    }
                    if (autoComplete) {
                        if(suggestion){
                          const quillEditor = quillRef.current.getQuill();
                          const currentPos = quillEditor.getSelection().index;
                          quillEditor.deleteText(currentPos, suggestion.length);
                          setSuggestion('')
                        }
                        if (e.key === ' ') {
                          if (inputValue.length >= 10) {
                              const quillEditor = quillRef.current.getQuill();
                              const currentPos = quillEditor.getSelection().index;
                              getSuggestions(quillEditor.getText(0, currentPos));
                          }
                        }
                      }
                }}
                headerTemplate={
                    <div id="toolbar">
                        <span className="ql-formats">
                            <button className="ql-bold"></button>
                            <button className="ql-italic"></button>
                            <button className="ql-underline"></button>
                        </span>
                        <span className="ql-formats">
                          <Toggle size="sm" labelText="" labelA="Auto Complete Off" labelB="Auto Complete On" defaultToggled={false} onToggle={(e)=>setAutoComplete(!autoComplete)} id="auto-complete" />
                        </span>
                    </div>
                } 
                style={{ height: '70vh' }} 
            />
        </div>
    );
};

export default RichTextEditor;
