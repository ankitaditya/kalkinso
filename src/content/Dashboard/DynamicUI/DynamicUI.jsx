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





export default function DynamicUI({item_id}) {
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
        const componentList = `
        Carbon.Accordion
        Carbon.AccordionItem
        Carbon.AspectRatio
        Carbon.Breadcrumb
        Carbon.Button
        Carbon.ButtonSet
        Carbon.Checkbox
        Carbon.CheckboxGroup
        Carbon.ClassPrefix
        Carbon.CodeSnippet
        Carbon.ComboBox
        Carbon.ComboButton
        Carbon.ComposedModal
        Carbon.ContainedList
        Carbon.ContentSwitcher
        Carbon.ContextMenu
        Carbon.Copy
        Carbon.CopyButton
        Carbon.DangerButton
        Carbon.DataTable
        Carbon.DataTableSkeleton
        Carbon.DatePicker
        Carbon.DatePickerInput
        Carbon.Dropdown
        Carbon.ErrorBoundary
        Carbon.ExpandableSearch
        Carbon.FileUploader
        Carbon.FilterableMultiSelect
        Carbon.FluidForm
        Carbon.Form
        Carbon.FormGroup
        Carbon.FormItem
        Carbon.FormLabel
        Carbon.Grid
        Carbon.IconSkeleton
        Carbon.IdPrefix
        Carbon.InlineLoading
        Carbon.Link
        Carbon.ListItem
        Carbon.Loading
        Carbon.Menu
        Carbon.MenuButton
        Carbon.Modal
        Carbon.ModalWrapper
        Carbon.MultiSelect
        Carbon.Notification
        Carbon.NumberInput
        Carbon.OrderedList
        Carbon.OverflowMenu
        Carbon.OverflowMenuItem
        Carbon.Pagination
        Carbon.PaginationSkeleton
        Carbon.PaginationNav
        Carbon.PasswordInput
        Carbon.PrimaryButton
        Carbon.ProgressIndicator
        Carbon.RadioButton
        Carbon.RadioButtonSkeleton
        Carbon.RadioButtonGroup
        Carbon.RadioTile
        Carbon.Search
        Carbon.SecondaryButton
        Carbon.Select
        Carbon.SelectItem
        Carbon.SelectItemGroup
        Carbon.SkeletonIcon
        Carbon.SkeletonPlaceholder
        Carbon.SkeletonText
        Carbon.Slider
        Carbon.Stack
        Carbon.StructuredList
        Carbon.Switch
        Carbon.Tab
        Carbon.TabContent
        Carbon.Tabs
        Carbon.Tag
        Carbon.TagSkeleton
        Carbon.TextArea
        Carbon.TextInput
        Carbon.Tile
        Carbon.TileGroup
        Carbon.TimePicker
        Carbon.TimePickerSelect
        Carbon.Toggle
        Carbon.ToggleSkeleton
        Carbon.ToggleSmallSkeleton
        Carbon.Toggletip
        Carbon.TreeView
        Carbon.UIShell
        Carbon.UnorderedList
        Carbon.unstable_FeatureFlags
        Carbon.unstable_useFeatureFlag
        Carbon.unstable_useFeatureFlags
        Carbon.unstable__FluidComboBox
        Carbon.unstable__FluidComboBoxSkeleton
        Carbon.unstable__FluidDatePicker
        Carbon.unstable__FluidDatePickerSkeleton
        Carbon.unstable__FluidDatePickerInput
        Carbon.unstable__FluidDropdown
        Carbon.unstable__FluidDropdownSkeleton
        Carbon.unstable__FluidMultiSelect
        Carbon.unstable__FluidMultiSelectSkeleton
        Carbon.unstable__FluidSelect
        Carbon.unstable__FluidSelectSkeleton
        Carbon.unstable__FluidTextArea
        Carbon.unstable__FluidTextAreaSkeleton
        Carbon.unstable__FluidTextInput
        Carbon.unstable__FluidTextInputSkeleton
        Carbon.unstable__FluidTimePicker
        Carbon.unstable__FluidTimePickerSkeleton
        Carbon.unstable__FluidTimePickerSelect
        Carbon.Heading
        Carbon.IconButton
        Carbon.Layer
        Carbon.unstable_Layout
        Carbon.unstable_LayoutDirection
        Carbon.unstable_useLayoutDirection
        Carbon.unstable_OverflowMenuV2
        Carbon.unstable_PageSelector
        Carbon.unstable_Pagination
        Carbon.Popover
        Carbon.ProgressBar
        Carbon.unstable__Slug
        Carbon.unstable__SlugContent
        Carbon.unstable__SlugActions
        Carbon.unstable__ChatButton
        Carbon.unstable__ChatButtonSkeleton
        Carbon.unstable__AiSkeletonText
        Carbon.unstable__AiSkeletonIcon
        Carbon.unstable__AiSkeletonPlaceholder
        Carbon.Stack
        Carbon.Tooltip
        Carbon.unstable_Text
        Carbon.unstable_TextDirection
        Carbon.DefinitionTooltip
        Carbon.Theme
        `;
        return `For my prompt, respond with only the plain code in text without any code formatting or markdown and no explanations needed.
                Assume the following imports are already included at the top of the file:
                import * as Carbon from '@carbon/react';
                import * as CarbonIBM from '@carbon/ibm-products';
                import * as CarbonIcons from '@carbon/icons-react';
                do not import anything.
                Use only the components listed below from the Carbon Component List:
                ${componentList}
                When generating the code:
                1. Use a functional React component named 'GeneratedComponent'.
                2. Utilize only the components available in the provided Carbon Component List. Avoid using any components that are not listed.
                3. Ensure that all JSX elements are correctly closed, properly nested, and syntactically correct.
                4. Use props accurately where needed and include default event handlers if applicable.
                5. If headings are required, use the Carbon.Heading component from the list. For layout and spacing, use Carbon.Grid, Carbon.Column, and Carbon.Stack components as appropriate.
                6. For links, use the Carbon.Link component. If a divider is needed, use Carbon.Stack for spacing or a simple <hr /> tag.
                7. Assume that a div with id "output" is present on the page for rendering.
                8. Do not include any inline styles or custom CSS unless explicitly specified in the prompt.
                At the end of your response, add these two lines:
                const root = createRoot(output);
                root.render(<GeneratedComponent />);
                Here is my prompt: ${prompt}`
    }

    const [ componentRenderer, setComponentRenderer ] = useState(<ComponentRenderer code={response} />);

    // Function to handle the API call to OpenAI
    const handleRunCode = async () => {
        setIsLoading(true); // Set loading to true while fetching data

        try {
            const resp = await axios.post(
                '/api/kalkiai/completions',
                JSON.stringify({
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

    useEffect(() => {
        setComponentRenderer(<ComponentRenderer code={response} />);    
    }, [response]);

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
                        componentPreviewContent={componentRenderer}
                    />
                    </div>
                </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}