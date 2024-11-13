import { createRoot } from 'react-dom/client';
import { transform } from '@babel/standalone';

// -------   Prompt Editor component --------

// Importing Editor component from Monaco Editor
import Editor from '@monaco-editor/react';


const PromptEditor = ({ prompt, setPrompt, handleRunCode, isLoading }) => {
    return (
        <div className="relative w-full h-full flex flex-col">
            <div className="flex justify-end p-2">
                {/* Button to trigger code generation */}
                <button
                    onClick={handleRunCode}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    disabled={isLoading}
                >
                    {isLoading && (
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    )}
                    Generate
                </button>
            </div>
            {/* Monaco Editor for entering the prompt */}
            <Editor
                height="100%"
                defaultLanguage="plaintext"
                defaultValue="// Enter your prompt here"
                value={prompt}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'off',
                    padding: { top: 10, bottom: 10 }
                }}
                onChange={(value) => setPrompt(value)}
            />
        </div>
    );
};


// -------   Code Preview component --------

const CodePreview = ({ code }) => {
    return (
        <div className="w-full h-full overflow-auto p-4 bg-gray-900 text-white">
            <pre className="whitespace-pre-wrap">{code}</pre>
        </div>
    );
};

// Component to render the generated React component
const ComponentRenderer = ({ code }) => {
    const runCode = (code) => {
        try {
            // Transform and execute the code using Babel
            const transformedCode = transform(
                `
        (function(React, createRoot, output, useState) {
          ${code}
        })(React, createRoot, document.getElementById('output'), React.useState);
        `,
                { presets: ['react'] }
            ).code;

            // Execute the transformed code
            new Function('React', 'createRoot', 'output', 'useState', transformedCode)(
                React,
                createRoot,
                document.getElementById('output'),
                React.useState
            );
        } catch (e) {
            console.error('Error executing code:', e.message);
        }
    };

    // Re-run code whenever the 'code' prop changes
    useEffect(() => {
        runCode(code);
    }, [code]);

    return (
        <div className="w-full h-full overflow-auto p-4">
            <div id="output" style={{ padding: '10px' }}></div>
        </div>
    );
};



const PreviewTabs = ({ codePreviewContent, componentPreviewContent }) => {
    const [activeTab, setActiveTab] = useState('component');

    return (
        <div className="w-full h-full">
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('component')}
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'component' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Component Preview
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'code' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Code Preview
                </button>
            </div>
            <div className="p-4 h-full">
                {activeTab === 'code' ? codePreviewContent : componentPreviewContent}
            </div>
        </div>
    );
};





export default function DynamicUI() {
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
        return `For my prompt, respond only the code in plain text without any code formatting or markdown and no explanations needed.
        Do not include any import statements.
        Add these 2 lines to the end of your response.
        const root = createRoot(output);
        root.render(<GeneratedComponent />);
        For example if based on the prompt the main component is HelloWorld.
        Then at the end of your response add:
          const root = createRoot(output);
          root.render(<HelloWorld />);
         Here is my prompt: ${prompt}`
    }

    // Function to handle the API call to OpenAI
    const handleRunCode = async () => {
        setIsLoading(true); // Set loading to true while fetching data

        try {
            const result = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
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
        <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
            <div className="flex flex-row space-x-4 w-full max-w-5xl h-2/3 bg-white shadow-lg p-4">
                {/* Prompt Editor Section */}
                <div className="flex-1 flex border rounded overflow-hidden">
                    <PromptEditor prompt={prompt} setPrompt={setPrompt} handleRunCode={handleRunCode} isLoading={isLoading} />
                </div>
                {/* Tabs Section for Code and Component Preview */}
                <div className="flex-1 flex border rounded overflow-hidden">
                    <div className="flex-1 flex border rounded overflow-hidden">
                        <PreviewTabs
                            codePreviewContent={<CodePreview code={response} />}
                            componentPreviewContent={<ComponentRenderer code={response} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}