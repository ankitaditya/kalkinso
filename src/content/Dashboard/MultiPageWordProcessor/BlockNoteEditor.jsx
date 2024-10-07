import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import TurndownService from 'turndown';
import { marked } from "marked";
import { formatToMarkdown } from "../utils";
import { setLoading } from "../../../actions/auth";
import { deleteFile, save } from "../../../actions/kits";

// Initialize Turndown to convert HTML to Markdown if needed
const turndownService = new TurndownService();
// import { getHexColor } from "./utils";

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
    // provider, 
    // doc
  }
) {
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent:JSON.parse(JSON.stringify(initialContent)).length>0?JSON.parse(JSON.stringify(initialContent)):[{type: "paragraph", content: "Write something..."}],
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
    if(initialContent&&typeof initialContent === "string"){
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
          await setContent(null);
        });
    }
  }, [initialContent]);

  // Renders the editor instance using a React component.
  return <BlockNoteView theme="light" editor={editor} onChange={()=>{
      setContent(JSON.stringify(editor.document));
  }} />;
}
 