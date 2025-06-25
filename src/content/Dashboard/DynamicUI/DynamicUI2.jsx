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

const CodePreview = ({ code, setResponse }) => {

    return (
        <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={code}
                value={code}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'off',
                    padding: { top: 10, bottom: 10 }
                }}
                onChange={(value) => setResponse(value)}
            />
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





export default function DynamicUI2({item_id}) {
    // State hooks for managing prompt, response, and loading status
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* Template function to format the prompt for OpenAI API

    Notice the change in prompt where we are asking the model to
add two new lines. This ensures the component gets rendered on the div
when it gets executed.
We need the model to generate this as we wont know what name the model will
give to the component

      */
    const promptTemplate = (prompt) => {
        return `For my prompt, respond with only the plain code in text without any code formatting or markdown and no explanations needed.
                When generating the code:
                do not import anything.
                1. Use a functional React component named 'GeneratedComponent'.
                2. Utilize only generic HTML tags (e.g., div, h1, p, a, button, input, etc.) and avoid using any external libraries or custom components.
                3. Ensure that all JSX elements are correctly closed, properly nested, and syntactically correct.
                4. Use props accurately where needed and include default event handlers if applicable.
                5. For headings, use HTML tags like h1, h2, h3, etc. For layout and spacing, use div elements with appropriate nesting.
                6. For links, use the a tag with an href attribute. If a divider is needed, use a simple <hr /> tag.
                7. Assume that a div with id "output" is present on the page for rendering.
                8. Do not include any inline styles or custom CSS unless explicitly specified in the prompt.
                At the end of your response, add these two lines:
                const root = createRoot(output);
                root.render(<GeneratedComponent />);
                Here is my prompt: ${prompt}`
    }

    // Function to handle the API call to OpenAI
    const handleRunCode = async () => {
        setIsLoading(true); // Set loading to true while fetching data

        try {
            const result = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o',
                    messages: [
                        {
                            "role": "system",
                            "content": "You are an expert react developer."
                        },
                        {
                            "role": "user",
                            "content": promptTemplate(prompt)
                        }
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    }
                }
            );

            // Update response state with the fetched data
            setResponse(result.data.choices[0].message.content);
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            setResponse('Error fetching response from OpenAI.');
        } finally {
            setIsLoading(false); // Reset loading status
        }
    };

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
                    <PreviewTabs
                        content={response}
                        folderPath={item_id}
                        codePreviewContent={<CodePreview code={response} setResponse={setResponse} />}
                        componentPreviewContent={<ComponentRenderer code={response} />}
                    />
                    </div>
                </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}