import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Toggle } from '@carbon/react';
import { DynamicUI } from './DynamicUI';
import { OptionsTile, pkg } from '@carbon/ibm-products';

pkg.component.OptionsTile = true;

const CodeEditor = ({file,setContent,setIsChanged,item_id, pathExternal, onKeyDown,...rest}) => {
  const editorRef = useRef(null);
  const modelConfig = {
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
}
  const [code, setCode] = useState('');
  const [ toggleValue, setToggleValue ] = useState(false);
  const [editorComponent, setEditorComponent] = useState(<></>);

  useEffect(() => {
    if(file&&!toggleValue){
      file.map((fileObj)=>{
        const ext = fileObj.filename.split('.').pop();
        axios.get(fileObj.value).then((res)=>{
          const ext = fileObj.filename.split('.').pop();
          setEditorComponent(
            <div
              style={{
                width: "96%",
                height: "90vh",
                margin: "auto",
              }}
            >
              <OptionsTile title={"AI Editor"} onToggle={(value) => setToggleValue(value)} enabled={toggleValue} locked={false} />
            <Editor
              height="70vh"
              width="96%"
              defaultLanguage={modelConfig[ext]?.language || modelConfig.default.language}
              defaultValue={typeof res.data==='string'?res.data:JSON.stringify(res.data,null,2)}
              theme="vs-light"
              onChange={(value, event) => {
                // console.log("Change is being made");
                setContent(value);
                onKeyDown();
                if(setIsChanged){
                  setIsChanged(true);
                }
              }}
              {...rest}
            />
            </div>
          );
          setCode({
            value: res.data,
            language: modelConfig[ext]?.language || modelConfig.default.language,
            theme: 'vs-light',
          });
        }).catch((err)=>{console.log(err)});
        return {filename:fileObj.filename, value: fileObj.value, ...modelConfig[ext] || modelConfig.default}
      })
    } else {
      setEditorComponent(
        <div
          style={{
            width: "96%",
            height: "90vh",
            margin: "auto",
          }}
        >
          <OptionsTile title={"AI Editor"} onToggle={(value) => setToggleValue(value)} enabled={toggleValue} locked={false} />
          <DynamicUI item_id={Object.values(pathExternal)[0].id} codeFile={item_id} />
        </div>
      );
    }
  }, [file, toggleValue]);

    return editorComponent
};

export default CodeEditor;
