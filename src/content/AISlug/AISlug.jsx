/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    unstable__Slug as Slug,
    unstable__SlugContent as SlugContent,
    unstable__SlugActions as SlugActions,
    TextArea,
    IconButton
} from '@carbon/react';
import { AiGenerate, Bot, ChatBot } from '@carbon/react/icons';
import BlockNoteEditor from '../Dashboard/BlockNoteEditor';
import { Children, useEffect, useState } from 'react';
import { suggestBetterText } from '../Dashboard/utils';

const AISlug = (contextFunc, name, context) => {
    const [initialContent, setInitialContent] = useState([
        {type: "paragraph", content: 'Welcome to the AI Slug!' }
    ]);
    const [content, setContent] = useState(null);
    const [contextComponent, setContextComponent] = useState(<BlockNoteEditor
                                            {...{
                                              initialContent, 
                                              setContent, 
                                            }}
                                          />);
    useEffect(()=>{
      if(initialContent){
        setContextComponent(<BlockNoteEditor
          {...{
            initialContent, 
            setContent, 
          }}
        />)
      }
    },[initialContent])
    return <Slug className="slug-container" size="xs" align="right">
    <SlugContent>
      <h4><Bot /></h4>
      <hr />
      {contextComponent}
      <SlugActions>
        {/* <IconButton kind="ghost" onClick={
          () => {
            if(content){
              suggestBetterText(content.map((block)=>Array.isArray(block.content)?block.content.map(val=>val.text).join(' '):null).join(' '),
            `Give suggestions for task ${name}`).then((res)=>{
                console.log(res);
                setContextComponent(<></>);
                setInitialContent([
                  {type: "paragraph", content: res}
                ]);
              }).catch((err)=>{
                console.log(err);
              });
            }
          }
        } label="Generate Random">
            <AiGenerate />
        </IconButton> */}
        <IconButton kind="ghost" onClick={
          () => {
            if(content){
              suggestBetterText(content.map((block)=>Array.isArray(block.content)?block.content.map(val=>val.text).join(' '):null).join(' '),
            `Give suggestions for task ${name}`).then((res)=>{
                // console.log(res);
                setContextComponent(<></>);
                setInitialContent([
                  {type: "paragraph", content: res}
                ]);
                contextFunc({
                  ...context,
                  [name]: res
                });
              }).catch((err)=>{
                // console.log(err);
              });
            }
          }
        } label="Chat">
            <ChatBot />
        </IconButton>
      </SlugActions>
    </SlugContent>
  </Slug>
}

export default AISlug;