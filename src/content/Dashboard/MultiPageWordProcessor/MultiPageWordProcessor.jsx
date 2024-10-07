// MultiPageWordProcessor.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import './MultiPageWordProcessor.css'; // Custom CSS for page styling
import BlockNoteEditor from './BlockNoteEditor';
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

function MultiPageWordProcessor({ initialContent, setContent, item_id, bucket, ...rest }) {
  const [pages, setPages] = useState([[]]); // Holds multiple pages of content
  const [editor, setEditor] = useState({});
  const dispatch = useDispatch();
  const blockTypeHeights = {
    paragraph: 40,          // Standard paragraph height
    heading: 80,            // Heading height
    bulletListItem: 30,     // Bullet list item height
    numberedListItem: 30,   // Numbered list item height
    checkListItem: 30,      // Check list item height
    table: 200,             // Table height
    file: 50,               // File block height
    image: 300,             // Image block height
    video: 400,             // Video block height
    audio: 100,             // Audio block height
  };
  const editorRef = useRef(null);

  const PAGE_HEIGHT = 1000; // Approx height of an A4 page in pixels
  const PAGE_WIDTH = 850; // Approx width of an A4 page in pixels

  // Function to get the block height based on its type
const getBlockHeight = (block) => {
    switch (block.type) {
      case 'paragraph':
        return blockTypeHeights.paragraph;
      case 'heading':
        return blockTypeHeights.heading;
      case 'bulletListItem':
        return blockTypeHeights.bulletListItem;
      case 'numberedListItem':
        return blockTypeHeights.numberedListItem;
      case 'checkListItem':
        return blockTypeHeights.checkListItem;
      case 'table':
        return blockTypeHeights.table;
      case 'file':
        return blockTypeHeights.file;
      case 'image':
        return blockTypeHeights.image;
      case 'video':
        return blockTypeHeights.video;
      case 'audio':
        return blockTypeHeights.audio;
      default:
        return blockTypeHeights.paragraph; // Default to paragraph height if unknown
    }
  };

  const paginate = (contentBlocks) => {
    setContent(JSON.stringify(contentBlocks));
    let pages = [];
    let currentPage = [];
    let currentPageHeight = 0;

    contentBlocks.forEach(({id, ...block}) => {
        const blockHeight = getBlockHeight(block);

        // If adding the block exceeds the page height, start a new page
        if (currentPageHeight + blockHeight > PAGE_HEIGHT) {
        pages.push(currentPage);
        currentPage = [block]; // Start new page with current block
        currentPageHeight = blockHeight; // Reset the height for the new page
        } else {
        currentPage.push(block); // Add block to current page
        currentPageHeight += blockHeight; // Increment the current page height
        }
    });

    // Add the last page if there are any remaining blocks
    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    setPages(pages);
  };

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
        console.log(JSON.parse(JSON.stringify(blocks)))
        paginate(JSON.parse(JSON.stringify(blocks)));
        await setContent(null);
        });
    } else if(initialContent && typeof initialContent === "object"){
    paginate(initialContent);
    setContent(null);
    }

  // Check and split content when it exceeds one page
  const paginateContent = useCallback(() => {
    const contentBlocks = [].concat(...Object.values(editor).map(data=>JSON.parse(data)))
    console.log(contentBlocks, editor)
    paginate(contentBlocks);
  }, [editor]);

  useEffect(() => {
    // Paginate the content whenever the editor changes
    if (Object.values(editor).length > 0) {
      paginateContent();
    }
  }, [editor, paginateContent]);

  return (
    <div className="word-processor" ref={editorRef}>
      {pages.length>0&&pages.map((pageContent, index) => {
            if (pageContent){
                console.log("This is page content: " ,pageContent)
                return (<div className="page" key={index} style={{ height: PAGE_HEIGHT, width: PAGE_WIDTH }}>
                    <BlockNoteEditor initialContent={pageContent} setContent={(value)=>{
                        if(value){
                            setEditor({...editor,[`page-${index}`]:value})
                        }
                    }} item_id={item_id} bucket={bucket} />
                </div>)
            } else {
                return <></>;
            }
        })}
    </div>
  );
}

export default MultiPageWordProcessor;