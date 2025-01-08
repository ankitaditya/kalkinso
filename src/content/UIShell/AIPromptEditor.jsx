import React from "react";
import "@blocknote/core/fonts/inter.css";
import { 
  useCreateBlockNote, 
  createReactInlineContentSpec,
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useComponentsContext,
  useBlockNoteEditor,
 } from "@blocknote/react";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import TurndownService from 'turndown';
import { convertToMarkdown, exportToPDF, formatToMarkdown } from "../Dashboard/utils";
import { setLoading } from "../../actions/auth";
import { deleteFile, save } from "../../actions/kits";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { Close, Download, MathCurve, Save } from "@carbon/react/icons";
import { ActionBar, EditInPlace } from "@carbon/ibm-products";
import { useParams } from "react-router-dom";

const turndownService = new TurndownService();

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
        editContent: `${prompt}: ${response}`
      };  
    return promptTemplates;
}

const MathBlock = ({ content }) => {
  const [html, setHtml] = useState('');

  React.useEffect(() => {
    try {
      const renderedHtml = katex.renderToString(content.replaceAll('$$',''), {
        throwOnError: false,
      });
      setHtml(renderedHtml);
    } catch (error) {
      console.error('Error rendering math:', error);
    }
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const mathBlockSpec = createReactInlineContentSpec(
  {   
    type: "math",
    propSchema: {
      text: {
        default: `$$\\frac{a}{b}$$`,
      },
    },
    content: "none",
  },
  {
    render: (props) => <span>
                          <MathBlock content={props.inlineContent.props.text.replaceAll('$$','').replace(/\s+/g,'')} />
                      </span>,
  });

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    math: mathBlockSpec,
  },
});

function InlineMathButton() {
  const editor = useBlockNoteEditor({ schema: schema });
  const Components = useComponentsContext()

  return editor ? (
    <Components.FormattingToolbar.Button
      mainTooltip={"Convert to Inline Math"}
      onClick={() => {
        const selectedText = editor.getSelectedText();
        if (/\$\$[^\$]+\$\$/.test(selectedText)) {
          editor.insertInlineContent([
            {
              type: "math",
              props: {
                text: selectedText,
              },
            },
          ]);
        }
      }}
    >
      <MathCurve />
    </Components.FormattingToolbar.Button>
  ) : null;
}

const generateAiPrompt = async (inputPrompt, document) => {
  // Replace with your AI API integration (e.g., OpenAI API)
  console.log("Generating AI prompt...: ", document);
  const resp = await axios.post(
    '/api/kalkiai/completions',
    JSON.stringify({
        model: 'gpt-4o',
        messages: [
            {
                "role": "system",
                "content": "You are an expert text editor and book writer in multi language."
            },
            {
                "role": "user",
                "content": promptTemplate(inputPrompt, document)['editContent']
            }
        ]
    }),
    {
        headers: {
            'Content-Type': 'application/json',
        },
    }
);
  return resp.data.result;
};

function AiPromptButton() {
    const dispatch = useDispatch();
    const editor = useBlockNoteEditor({
      // Ensure schema is properly defined
      extensions: [schema],
    });
  
    const Components = useComponentsContext();
  
    // Return null if the editor is not initialized
    if (!editor) return null;
  
    // Function to handle AI Prompt generation
    const handleGenerateAiPrompt = async () => {
      try {
        // Display a prompt dialog to the user
        const inputPrompt = prompt("Enter your AI prompt:");
        
        // Ensure the prompt was provided
        if (!inputPrompt) return;
        dispatch(setLoading(true));
        // Generate AI prompt based on user input and current editor content
        const currentContent = editor.getSelectedText();
        const aiPrompt = await generateAiPrompt(inputPrompt, currentContent);
        const currentBlock = editor.getTextCursorPosition().block;
        const newBlocks = await editor.tryParseMarkdownToBlocks(aiPrompt);
        // Replace the content in the editor with the generated AI prompt
        editor.replaceBlocks([currentBlock], newBlocks);
      } catch (error) {
        console.error("Error generating AI prompt:", error);
      }
      dispatch(setLoading(false));
    };
  
    return (
      <Components.FormattingToolbar.Button
        mainTooltip="Generate AI Prompt"
        onClick={handleGenerateAiPrompt}
      >
        AI Prompt
      </Components.FormattingToolbar.Button>
    );
  }

export default function BlockNoteEditor(
  {
    initialContent, 
    item_id,
    bucket,
    onKeyDown,
    markdown=false,
    ...rest
  }
) {
  const profile = useSelector((state) => state.profile);
  const [fileName, setFileName] = useState("Untitled Document");
  const [ isChanged, setIsChanged ] = useState(false);
  const dispatch = useDispatch();
  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: initialContent ?
      Array.isArray(initialContent) ? initialContent : [{ type: "paragraph", content: "Loading..." }] :
      [{ type: "paragraph", content: "Write something..." }],
  });

  useEffect(() => {
    if (typeof initialContent === 'string' && !markdown) {
      axios.get(initialContent).then(async (res) => {
        let blocks = res.data;
        if (initialContent.split('?')[0].endsWith('.pdf') && typeof blocks !== "object") {
          dispatch(setLoading(true));
          blocks = await extractTextFromPDF(initialContent);
          blocks = await editor.tryParseMarkdownToBlocks(blocks);
          dispatch(save(bucket, item_id.replace('.pdf', '.txt'), JSON.stringify(blocks)));
          dispatch(deleteFile(bucket, item_id, false));
        }
        if (typeof blocks === "string") {
          blocks = await editor.tryParseMarkdownToBlocks(blocks);
        }
        editor.replaceBlocks(editor.document, blocks);
        if (setIsChanged) {
          setIsChanged(null);
        }
      });
    } else if (typeof initialContent === 'string' && markdown) {
      editor.tryParseMarkdownToBlocks(initialContent).then((blocks) => {
        editor.replaceBlocks(editor.document, blocks);
      });
    }
  }, [initialContent]);

  const convertToMarkdown = (htmlContent) => {
    return turndownService.turndown(htmlContent);
  };

  const extractTextFromPDF = async (pdfUrl) => {
    const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
    let fullText = '';
  
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
  
      // Initialize variables to store formatted text
      let pageFormattedText = '';
      let previousY = null; // Store the Y coordinate to detect line breaks
  
      textContent.items.forEach((item, index) => {
        const currentY = item.transform[5]; // Y coordinate of the text
  
        // Detect a new line based on the Y coordinate difference
        if (previousY && Math.abs(previousY - currentY) > 10) {
          pageFormattedText += '\n'; // Insert a line break when a new line starts
        }
  
        // Append text to the current line
        pageFormattedText += item.str + ' ';
  
        // Update previousY to currentY for the next iteration
        previousY = currentY;
      });
  
      // Add the formatted text of the current page
      fullText += pageFormattedText.trim() + '\n\n'; // Add spacing between pages
    }
  
    // Optionally convert the extracted text to Markdown
    const result = await formatToMarkdown(convertToMarkdown(fullText))
    return result;
  };

  return <><strong style={{
    fontSize: "1.5rem",
  }}><EditInPlace value={fileName} onChange={(e)=>setFileName(e)} onSave={(e)=>{
    if(profile.user && fileName) {
      dispatch(setLoading(true));
      dispatch(save("kalkinso.com", `users/${profile.user}/tasks/tools/writing-assistant/${fileName}.txt`, JSON.stringify(editor.document)));
      setIsChanged(false);
      // setContent(null);
    }
  }} /></strong><ActionBar
  actions={[
    {
      id: 'save',
      key: 'save',
      renderIcon: ()=><Save />,
      label: 'Save',
      iconDescription: 'Save',
      disabled: !isChanged,
      onClick: () => {
        dispatch(setLoading(true));
        dispatch(save('kalkinso.com', `users/${profile.user}/tasks/tools/writing-assistant/${fileName}.txt`, JSON.stringify(editor.document)));
        setIsChanged(false);
        // setContent(null);
      }
    },
    {
      id: 'download',
      key: 'download',
      renderIcon: ()=><Download />,
      label: 'Download',
      iconDescription: 'Download',
      onClick: () => {
        if (true) {
          dispatch(setLoading(true));
          exportToPDF(editor.document, fileName)
            .then(() => {
              dispatch(setLoading(false));
            })
            .catch((error) => {
              dispatch(setLoading(false));
              console.error(error);
            })
            .finally(() => {
              dispatch(setLoading(false));
            });
        } else {
          // const aTag = document.createElement("a");
          // aTag.href = item.signedUrl;
          // aTag.download = item.title;
          // document.body.appendChild(aTag);
          // aTag.click();
          // aTag.remove();
        }
      }
    },
    // {
    //   id: 'close',
    //   key: 'close',
    //   renderIcon: ()=><Close />,
    //   label: 'Close',
    //   iconDescription: 'Close',
    //   onClick: () => {
    //     // setMultiSelection(multiSelection.filter((item_id) => item_id !== item.id));
    //   }
    // }
  ]
  } 
  rightAlign={true}
  containerWidth={800}
  style={{marginRight: "2.5rem", marginLeft: "2.5rem", marginTop: "1rem"}}
/><div className='word-processor'>
    <BlockNoteView {...rest} className="page" style={{
    marginTop: "2rem",
  }} theme="light" editor={editor} formattingToolbar={false} onChange={(props) => {
      // setContent(editor.document);
      // onKeyDown();
      if (setIsChanged) {
        setIsChanged(true);
      }
    }}
  >
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          <BlockTypeSelect key={"blockTypeSelect"} />
          <InlineMathButton key={"inlineMath"} />
          <AiPromptButton key={"aiPromptButton"} />
          <FileCaptionButton key={"fileCaptionButton"} />
          <FileReplaceButton key={"replaceFileButton"} />

          <BasicTextStyleButton
            basicTextStyle={"bold"}
            key={"boldStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"italic"}
            key={"italicStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"underline"}
            key={"underlineStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"strike"}
            key={"strikeStyleButton"}
          />
          <BasicTextStyleButton
            key={"codeStyleButton"}
            basicTextStyle={"code"}
          />

          <TextAlignButton
            textAlignment={"left"}
            key={"textAlignLeftButton"}
          />
          <TextAlignButton
            textAlignment={"center"}
            key={"textAlignCenterButton"}
          />
          <TextAlignButton
            textAlignment={"right"}
            key={"textAlignRightButton"}
          />

          <ColorStyleButton key={"colorStyleButton"} />

          <NestBlockButton key={"nestBlockButton"} />
          <UnnestBlockButton key={"unnestBlockButton"} />

          <CreateLinkButton key={"createLinkButton"} />
        </FormattingToolbar>
      )}
    />
  </BlockNoteView></div></>;
}
