import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { transform } from '@babel/standalone';
import { Dialog } from 'primereact/dialog';

// -------   Prompt Editor component --------

// Importing Editor component from Monaco Editor
import Editor from '@monaco-editor/react';
import { Button } from '@carbon/react';
import { Loading } from 'carbon-components-react';
import * as Carbon from '@carbon/react';
import * as CarbonIBM from '@carbon/ibm-products';
import * as CarbonIcons from '@carbon/icons-react';

import { Splitter, SplitterPanel } from 'primereact/splitter';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InsertModal } from '../../../components/Modal';
import { useDispatch } from 'react-redux';
import { save } from '../../../actions/kits';
import BlockNoteEditor from '../BlockNoteEditor';
import PhotoEditor from '../PhotoEditor';


const PromptEditor = ({ prompt, setPrompt, handleRunCode, isLoading }) => {
    return (
        <Carbon.Grid>
            {/* Button to trigger code generation */}
            <Carbon.Column style={{marginBottom:"15px", width:"100%", alignItems:"right"}}>
                <Button
                onClick={handleRunCode}
                disabled={isLoading}
                size='sm'
                kind='secondary'
                >
                {isLoading ? (
                    <Loading withOverlay={false} active={isLoading} small />
                ) : (
                    "Generate"
                )}
                </Button>
            </Carbon.Column>

            {/* Monaco Editor for entering the prompt */}
            <Carbon.Column sm={4} md={8} lg={16}>
                <Editor
                defaultLanguage="plaintext"
                defaultValue="// Enter your prompt here"
                value={prompt}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'off',
                    padding: { top: 10, bottom: 10 },
                    fontSize: 14,
                    scrollbar: { vertical: 'auto' },
                    automaticLayout: true,
                }}
                onChange={(value) => setPrompt(value)}
                />
            </Carbon.Column>
            </Carbon.Grid>

    );
};


// -------   Code Preview component --------

const CodePreview = ({ code, setResponse, initialContent, setContent,...rest }) => {
    const [component, setComponent] = useState(<PhotoEditor image_uri={code} {...rest} className='page' style={{width:"100%", height:"100vh"}} />);
    useEffect(() => {
        if(code) {
            setComponent(<PhotoEditor image_uri={code} {...rest} className='page' style={{width:"100%", height:"100vh"}} />);
            setContent(code);
        }
    }, [code]);
    return (
        // <Editor
        //         height="100%"
        //         width="100%"
        //         defaultLanguage="javascript"
        //         defaultValue={code}
        //         value={code}
        //         options={{
        //             minimap: { enabled: false },
        //             lineNumbers: 'off',
        //             padding: { top: 10, bottom: 10 }
        //         }}
        //         onChange={(value) => setResponse(value)}
        //     />
        component
    );
};

// Component to render the generated React component in a full-page modal
const ComponentRenderer = ({ code }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const runCode = (code) => {
        try {
            // Transform and execute the code using Babel
            const transformedCode = transform(
                `
                (function(React, createRoot, output, useState, Carbon, CarbonIBM, CarbonIcons) {
                    ${code}
                })(React, createRoot, document.getElementById('output'), React.useState, Carbon, CarbonIBM, CarbonIcons);
                `,
                { presets: ['react'] }
            ).code;

            // Execute the transformed code
            new Function('React', 'createRoot', 'output', 'useState', 'Carbon', 'CarbonIBM', 'CarbonIcons', transformedCode)(
                React,
                createRoot,
                document.getElementById('output'),
                React.useState,
                Carbon,
                CarbonIBM,
                CarbonIcons
            );
        } catch (e) {
            console.error('Error executing code:', e.message);
        }
    };

    // Re-run code whenever the 'code' prop changes
    useEffect(() => {
        if (code) {
            setIsModalOpen(true); // Open the modal when new code is received
        }
    }, [code]);

    useEffect(() => {
        if (isModalOpen) {
            runCode(code); // Run the code when the modal is open
        }
    }, [isModalOpen]);

    return (
        <div id="output" style={{ height: '100%', overflow: 'auto' }}></div>
    );
};



const PreviewTabs = ({ content, folderPath ,codePreviewContent, componentPreviewContent }) => {
    const [activeTab, setActiveTab] = useState('code');
    const [ openInsertModal, setOpenInsertModal ] = useState(false);
    const dispatch = useDispatch();
    const createFile = (fileName) => {
        dispatch(save('kalkinso.com', fileName, content, true));
    };

    return (
        <>
        <InsertModal open={openInsertModal} defaultFolderPath={folderPath} setOpen={setOpenInsertModal} onAdd={createFile} />
        <Carbon.Grid className="w-full h-full">
            <Carbon.Column sm={4} md={8} lg={16}>
                <Carbon.ContentSwitcher onChange={({name})=>setActiveTab(name)} selectedIndex={1} size="sm">
                    <Carbon.Switch name="component" text="Component Preview" style={{zIndex:0}} />
                    <Carbon.Switch name="code" text="Code Preview" style={{zIndex:0}} />
                    <Carbon.IconButton kind='secondary' label="Save" align='bottom' renderIcon={CarbonIcons.Save} onClick={() => setOpenInsertModal(true)} />
                </Carbon.ContentSwitcher>
            </Carbon.Column>
            <Carbon.Column sm={4} md={8} lg={16}>
                {activeTab === 'code' ? codePreviewContent : componentPreviewContent}
            </Carbon.Column>
        </Carbon.Grid>
        </>
    );
};





export default function DynamicImage({codeFile, PromptType='bookWriter', ...rest}) {
    // State hooks for managing prompt, response, and loading status
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState(codeFile);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState(PromptType);

    /* Template function to format the prompt for OpenAI API

    Notice the change in prompt where we are asking the model to
add two new lines. This ensures the component gets rendered on the div
when it gets executed.
We need the model to generate this as we wont know what name the model will
give to the component

      */
    const promptTemplate = (prompt, response) => {
        const promptTemplates = {
            bookWriter: `
              For my prompt, generate an image that visually represents the theme, setting, or concept of a book. 
              When generating the image:
              1. Ensure the style is detailed and professional, appropriate for use as a book cover or thematic artwork.
              2. Incorporate elements like characters, landscapes, or symbolic imagery that reflect the book's genre (e.g., fantasy, science fiction, mystery).
              3. Use a visually engaging color palette and composition.
              4. If a previous response exists, incorporate its themes into the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            researchPaperWriter: `
              For my prompt, generate an image that complements an academic research paper. 
              When generating the image:
              1. Include diagrams, charts, or visual aids that help explain the paper's main findings or concepts.
              2. Use a clean, professional, and scholarly style.
              3. If applicable, incorporate scientific or technical elements relevant to the subject.
              4. If a previous response exists, integrate its data or themes into the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            taskDescriptionWriter: `
              For my prompt, generate an image that illustrates or supports a detailed task description. 
              When generating the image:
              1. Include clear, step-by-step visual instructions or representations of the task.
              2. Use icons, diagrams, or illustrations to enhance understanding.
              3. Ensure the design is clean, modern, and easy to interpret.
              4. If a previous response exists, align the visual content with the provided instructions.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            sopWriter: `
              For my prompt, generate an image that complements a Standard Operating Procedure (SOP). 
              When generating the image:
              1. Include flowcharts, diagrams, or illustrations that clarify the procedure.
              2. Use a professional and straightforward design style.
              3. Incorporate any relevant visual elements that enhance understanding of the steps.
              4. If a previous response exists, reflect its steps or content in the visual.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            questionPaperWriter: `
              For my prompt, generate an image that can be used in a professionally formatted question paper. 
              When generating the image:
              1. Include educational visuals, diagrams, or illustrations relevant to the subject.
              2. Use a clean and academic style appropriate for a classroom setting.
              3. Avoid overly complex visuals that may confuse students.
              4. If a previous response exists, reflect its context in the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            standardWorkInstructionDocument: `
              For my prompt, generate an image that supports a Standard Work Instruction (SWI) document. 
              When generating the image:
              1. Include step-by-step diagrams, process flowcharts, or illustrations that clarify instructions.
              2. Use a professional and easy-to-follow visual style.
              3. Ensure alignment with the document’s content and tone.
              4. If a previous response exists, integrate its relevant aspects into the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            businessPlanWriter: `
              For my prompt, generate an image that visually represents a business plan. 
              When generating the image:
              1. Include charts, graphs, or conceptual visuals related to market analysis, financial projections, or strategies.
              2. Use a professional, modern, and visually engaging style.
              3. Incorporate relevant branding or thematic elements if specified.
              4. If a previous response exists, use it to inform the visual content.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            pcbComponentList: `
              For my prompt, generate an image that complements a PCB component list. 
              When generating the image:
              1. Include detailed visual representations of the PCB layout, components, or design schematics.
              2. Use a clean and technical style with appropriate labels.
              3. Highlight key components or features as described in the prompt.
              4. If a previous response exists, reflect its details in the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            additionalCategory: `
              For my prompt, generate an image that matches the provided description or theme. 
              When generating the image:
              1. Ensure the visual elements are consistent with the specified category or purpose.
              2. Use an appropriate style and level of detail as requested.
              3. If a previous response exists, incorporate its context into the new image.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          };  
        return promptTemplates[type];
    }

    // Function to handle the API call to OpenAI
    const handleRunCode = async () => {
        setIsLoading(true); // Set loading to true while fetching data

        try {
            const resp = await axios.post(
                '/api/kalkiai/images',
                JSON.stringify({
                    params: {
                        "model": "dall-e-3",
                        "prompt": promptTemplate(prompt, response),
                        "n": 1,
                        "size": "1024x1024",
                    },
                    key: rest?.item_id?.split('.').slice(0,-1)[0]+'.jpeg',
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Update response state with the fetched data
            const json_response = resp.json();
            setResponse(json_response?.data[0]?.url);
            setPrompt(json_response?.data[0]?.revised_prompt)
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            setResponse('Error fetching response from OpenAI.');
        } finally {
            setIsLoading(false); // Reset loading status
        }
    };

    // useEffect(() => {
    //     setComponentRenderer(<ComponentRenderer code={response} />);    
    // }, [response]);

    return (
        <div style={{height:"70vh"}}>   
            <div>
                <Splitter style={{ height: '84vh' }} className="dashboard-splitter">
                {/* Prompt Editor Section */}
                <SplitterPanel size={50} minSize={30}>
                    <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-gray-50 p-4">
                    <PromptEditor 
                        prompt={prompt} 
                        setPrompt={setPrompt} 
                        handleRunCode={handleRunCode} 
                        isLoading={isLoading} 
                    />
                    </div>
                </SplitterPanel>
                
                {/* Tabs Section for Code and Component Preview */}
                <SplitterPanel size={50} minSize={30}>
                    <div className="flex flex-col h-full w-full border rounded-lg overflow-auto bg-gray-50 p-4">
                        <CodePreview code={response} codeFile={codeFile} setResponse={setResponse} {...rest} />
                    </div>
                </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}