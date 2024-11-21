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
    const [component, setComponent] = useState(<BlockNoteEditor 
        initialContent={code}
        setContent={(content)=>{
            setResponse(content)
            setContent(content)
        }}
        // markdown={true}
        {...rest}
    />);
    useEffect(() => {
        if(code) {
            setComponent(<BlockNoteEditor 
                initialContent={code}
                setContent={(content)=>{
                    setResponse(content)
                    setContent(content)
                }}
                markdown={true}
                {...rest}
            />);
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





export default function DynamicText({codeFile, PromptType='bookWriter', ...rest}) {
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
    const promptTemplates = {
        "Book Writer": "bookWriter",
        "Research Paper Writer": "researchPaperWriter",
        "Task Description Writer": "taskDescriptionWriter",
        "SOP Writer": "sopWriter",
        "Question Paper Writer": "questionPaperWriter",
        "Standard Work Instruction Document": "standardWorkInstructionDocument",
        "Business Plan Writer": "businessPlanWriter",
        "PCB Component List": "pcbComponentList",
    }
    const promptTemplate = (prompt, response) => {
        const promptTemplates = {
            bookWriter: `
              For my prompt, respond with detailed, professionally written text formatted in Markdown. 
              When generating the response:
              1. Ensure the content is well-structured with proper headings (e.g., #, ##, ###) and subheadings.
              2. Use lists, bullet points, and tables where appropriate.
              3. Include references or citations if necessary and applicable.
              4. Provide a concise yet comprehensive introduction and conclusion.
              5. Ensure the tone is professional, engaging, and appropriate for the audience.
              6. If a previous response exists, incorporate it logically and contextually into the new output.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            researchPaperWriter: `
              For my prompt, generate a well-researched academic-style response formatted in Markdown. 
              When generating the response:
              1. Provide a clear abstract, introduction, main body (with sections and subsections), and conclusion.
              2. Use proper Markdown formatting for headers, lists, and citations.
              3. Include detailed analysis, references, and citations in a standard format (e.g., APA, MLA, or IEEE as specified).
              4. Ensure the language is formal, precise, and scholarly.
              5. If a previous response exists, integrate its findings into the new document.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            taskDescriptionWriter: `
              For my prompt, generate a detailed task description in Markdown format. 
              When generating the response:
              1. Clearly define the task objectives and requirements.
              2. Provide a step-by-step guide or instructions as necessary.
              3. Use bullet points or numbered lists for clarity.
              4. Include prerequisites, deliverables, and timelines if applicable.
              5. If a previous response exists, ensure it is referenced or integrated appropriately.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            sopWriter: `
              For my prompt, generate a detailed Standard Operating Procedure (SOP) in Markdown format. 
              When generating the response:
              1. Include a clear title, purpose, scope, and responsibilities section.
              2. Provide step-by-step instructions, each with its own subsection.
              3. Use bullet points, numbered lists, or flowcharts as needed.
              4. Ensure clarity, precision, and professionalism.
              5. If a previous response exists, incorporate its relevant content into the new SOP.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            questionPaperWriter: `
              For my prompt, generate a professionally formatted question paper in Markdown. 
              When generating the response:
              1. Include a title, instructions for students, and clear section divisions (e.g., Section A, Section B).
              2. Provide a variety of questions (e.g., multiple-choice, short answers, and essays) with proper numbering.
              3. Include a total marks section and individual marks allocation for each question.
              4. Ensure the formatting is clear and clean.
              5. If a previous response exists, integrate any relevant content appropriately.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            standardWorkInstructionDocument: `
              For my prompt, generate a detailed Standard Work Instruction (SWI) document in Markdown format. 
              When generating the response:
              1. Include a title, purpose, and scope section.
              2. Provide a step-by-step guide with detailed instructions.
              3. Use tables, diagrams, or lists where appropriate for clarity.
              4. Ensure the language is clear and professional.
              5. If a previous response exists, integrate it seamlessly into the new SWI.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            businessPlanWriter: `
              For my prompt, generate a highly detailed business plan in Markdown format. 
              When generating the response:
              1. Include an executive summary, market analysis, marketing strategy, financial plan, and operational plan.
              2. Provide tables, charts, or bullet points as necessary for clarity.
              3. Ensure a professional and persuasive tone throughout.
              4. If a previous response exists, incorporate its insights or data appropriately.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          
            pcbComponentList: `
              For my prompt, generate a detailed list of components required for PCB manufacturing, including URLs, formatted in Markdown. 
              When generating the response:
              1. List each component with its name, description, specifications, and link to purchase or source.
              2. Use a table format for clarity (columns: Component Name, Description, Specifications, URL).
              3. Ensure all information is accurate and up-to-date.
              4. If a previous response exists, ensure any additions or updates are reflected in the output.
              Here is my prompt: ${prompt}
              Previous Response: ${response}
            `,
          };  
        return promptTemplates;
    }

    const [ componentRenderer, setComponentRenderer ] = useState(<ComponentRenderer code={response} />);

    // Function to handle the API call to OpenAI
    const handleRunCode = async (type) => {
        setIsLoading(true); // Set loading to true while fetching data

        try {
            const resp = await axios.post(
                '/api/kalkiai/completions',
                JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            "role": "system",
                            "content": "You are an expert text editor in multi language."
                        },
                        {
                            "role": "user",
                            "content": promptTemplate(prompt, response)[type]
                        }
                    ]
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Update response state with the fetched data
            setResponse(resp.data.result);
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
                    <center><Carbon.Select style={{margin:"1rem"}} noLabel={true} labelText="Prompt Type" id="prompt-type" defaultValue={type} value={type} onChange={(e) => setType(e.target.value)}>
                        {Object.keys(promptTemplates).map((key) => <Carbon.SelectItem text={key} value={promptTemplates[key]} />)}
                    </Carbon.Select></center>
                    <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-gray-50 p-4">
                    <PromptEditor 
                        prompt={prompt} 
                        setPrompt={setPrompt} 
                        handleRunCode={()=>handleRunCode(type)} 
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