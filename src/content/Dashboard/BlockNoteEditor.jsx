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
  createReactBlockSpec,
  useComponentsContext,
  useEditorContentOrSelectionChange,
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
import { marked } from "marked";
import { formatToMarkdown } from "./utils";
import { setLoading } from "../../actions/auth";
import { deleteFile, save } from "../../actions/kits";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { MathCurve } from "@carbon/react/icons";
import { handleSaveShortcuts } from "../../utils/redux-cache";

// Initialize Turndown to convert HTML to Markdown if needed
const turndownService = new TurndownService();

// import { getHexColor } from "./utils";

const MathBlock = ({ content }) => {
  const [html, setHtml] = useState('');

  React.useEffect(() => {
    // Render the LaTeX formula using KaTeX
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
  })

  function InlineMathButton() {
    const editor = useBlockNoteEditor({ schema: schema });
    const Components = useComponentsContext()
    // Ensure the schema is only set up after the component is mounted on the client
  
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
    ) : null; // Render nothing while editor is not initialized
  }

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
 
export default function BlockNoteEditor(
  {
    initialContent, 
    setContent, 
    item_id,
    bucket,
    setIsChanged,
    onKeyDown,
    ...rest
    // provider, 
    // doc
  }
) {
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema:schema,
    initialContent:initialContent?Array.isArray(initialContent)?initialContent:[{ type: "paragraph", content: "Loading..." }]:[{ type: "paragraph", content: "Write something..." }],
    // collaboration: {
    //   // The Yjs Provider responsible for transporting updates:
    //   provider,
    //   // Where to store BlockNote data in the Y.Doc:
    //   fragment: doc.getXmlFragment("document-store"),
    //   // Information (name and color) for this user:
    //   user: {
    //     name: profile?.username,
    //     color: getHexColor(),
    //   },
    // },
  });
  
  useEffect(() => {
    if(typeof initialContent==='string'){
        axios.get(initialContent).then(async (res) => {
          let blocks = res.data;
          if (initialContent.split('?')[0].endsWith('.pdf')&&typeof blocks !== "object") {
            dispatch(setLoading(true));
            blocks = await extractTextFromPDF(initialContent);
            blocks = await editor.tryParseMarkdownToBlocks(blocks);
            dispatch(save(bucket, item_id.replace('.pdf','.txt'), JSON.stringify(blocks)));
            dispatch(deleteFile(bucket, item_id, false));
          }
          if (typeof blocks === "string") {
            blocks = await editor.tryParseMarkdownToBlocks(blocks);
          }
          editor.replaceBlocks(editor.document, blocks);
          if(setIsChanged){
            setIsChanged(null);
          }
        });
    }
  }, [initialContent]);

  // Renders the editor instance using a React component.
  return <BlockNoteView {...rest} theme="light" editor={editor} formattingToolbar={false} onChange={(props)=>{
      setContent(editor.document);
      onKeyDown();
      if(setIsChanged){
        setIsChanged(true);
      }
  }}
  >
    <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />
            <InlineMathButton key={"inlineMath"} />
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
            {/* Extra button to toggle code styles */}
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
  </BlockNoteView>;
}
 