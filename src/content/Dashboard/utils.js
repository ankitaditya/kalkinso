import { Document, Folder } from "@carbon/react/icons";
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // For table generation
import html2canvas from "html2canvas"; // For image handling

// Initialize constants
const pageWidth = 595.28; // A4 page width in jsPDF
const pageHeight = 841.89; // A4 page height in jsPDF
const margin = 20; // 20px margin on all sides
const usableWidth = pageWidth - 2 * margin; // Usable width after margins
const usableHeight = pageHeight - 2 * margin; // Usable height after margins

let yOffset = margin; // Start content placement after top margin
let pageNumber = 1; // Page number starts from 1

export function getClassyColor() {
    // Generate a "classy" color by controlling the HSL values
    const h = Math.floor(Math.random() * 360); // Random hue (0 to 360 degrees)
    const s = Math.floor(Math.random() * 20) + 30; // Saturation between 30% and 50% (less saturated)
    const l = Math.floor(Math.random() * 30) + 40; // Lightness between 40% and 70% (softer tones)
  
    return `hsl(${h}, ${s}%, ${l}%)`; // Return the classy color in HSL format
  }
  
export function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
  
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
  
    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  
    return `#${r}${g}${b}`; // Return the hex code
  }
  
 export const getHexColor = () => {
    // Example usage to generate a classy color in hex format
    const classyColorHSL = getClassyColor();  // Generates HSL format color
    const [h, s, l] = classyColorHSL.match(/\d+/g); // Extract h, s, l from HSL string
    const classyHexColor = hslToHex(Number(h), Number(s), Number(l)); // Convert HSL to Hex
    
    return classyHexColor
 }

export const buildPathToTree = (paths) => {
  const root = [];
  let idCounter = 1;

  const addToTree = (pathParts, parentArray) => {
    const part = pathParts.shift(); // Remove the first part of the path
    if (!part) return;

    // Check if the part already exists in the parent array
    let existingNode = parentArray.find(node => node.value === part);

    if (!existingNode) {
      // Create a new node (folder or file)
      const isFile = pathParts.length === 0;
      const newNode = {
        id: String(idCounter++),
        value: part,
        label: part,
        renderIcon: isFile ? Document : Folder,
        ...(isFile ? {} : { children: [] })
      };
      parentArray.push(newNode);
      existingNode = newNode;
    }

    // Recurse into the next level if it's a folder
    if (existingNode.children) {
      addToTree(pathParts, existingNode.children);
    }
  };

  paths.forEach(path => {
    const pathParts = path.split('/').filter(Boolean); // Split path and remove empty strings
    addToTree(pathParts, root); // Add the path parts to the tree structure
  });

  return root;
}

export async function formatToMarkdown(text) {
  const apiKey = 'sk-svcacct-16C5MqAnAgGhXhWdicxUT3BlbkFJrSevL2eqFeRBmV1lQDN4';

  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful assistant that formats text into beautiful Markdown.',
    },
    {
      role: 'user',
      content: `Please format the following text into Markdown:\n\n${text}`,
    },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const formattedText = response.data.choices[0].message.content.trim();
    return formattedText;
  } catch (error) {
    console.error('Error formatting text:', error);
    return null;
  }
}

export async function suggestBetterText(text, title) {

  if (!text) {
    alert("Please enter some text");
    return;
  }

  const apiKey = 'sk-svcacct-16C5MqAnAgGhXhWdicxUT3BlbkFJrSevL2eqFeRBmV1lQDN4';

  const messages = [
    {
      role: 'system',
      content: 'You are an assistant that provides better suggestions for improving text input and giving ideas.',
    },
    {
      role: 'user',
      content: `${title?title:'text'}:\n\n${text}`,
    },
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const suggestedText = response.data.choices[0].message.content.trim();
    return suggestedText;
  } catch (error) {
    console.error('Error suggesting better text:', error);
    alert('Error in fetching suggestion, please try again.');
  }
}


// Helper function to add a new page with page numbering
const addNewPage = (pdf) => {
  pdf.text(`Page ${pageNumber}`, pageWidth - margin - 50, pageHeight - margin + 10);
  pdf.addPage();
  yOffset = margin;
  pageNumber++;
};

// Function to add text content with proper yOffset and page management
const addTextContent = (pdf, text, options = {}) => {
  const textHeight = pdf.getTextDimensions(text).h;
  if (yOffset + textHeight > usableHeight) {
    addNewPage(pdf);
  }
  pdf.text(text, margin, yOffset, options);
  yOffset += textHeight + 10; // Adjust yOffset after each text block
};

// Recursively handle nested content (for paragraphs, inline styles, etc.)
const handleNestedContent = (pdf, content, props=null) => {
  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (item.type === "text") {
        const { bold, italic, textColor, backgroundColor } = props || item.styles || {};
        const fontStyle = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
        pdf.setFont("helvetica", fontStyle);
        if (textColor) pdf.setTextColor(textColor==="default" ? "3F3F3F" : textColor); // Set text color
        if (backgroundColor) {
          const textWidth = pdf.getTextWidth(item.text);
          pdf.setFillColor(backgroundColor==="default" ? "FFFFFF" : backgroundColor);
          pdf.rect(margin, yOffset - 5, textWidth, 10, "F");
        }
        addTextContent(pdf, item.text);
        pdf.setTextColor(0, 0, 0); // Reset text color
      } else if (item.type === "link") {
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(item.content, margin, yOffset, { url: item.href });
        const linkHeight = pdf.getTextDimensions(item.content).h;
        yOffset += linkHeight + 10;
        pdf.setTextColor(0, 0, 0); // Reset text color
      }
    });
  } else {
    addTextContent(pdf, content);
  }
};

// Function to handle paragraphs
const handleParagraph = (pdf, block) => {
  if (block.content) {
    handleNestedContent(pdf, block.content, block.props);
  }
};

// Function to handle headings
const handleHeading = (pdf, block) => {
  pdf.setFontSize(18);
  handleNestedContent(pdf, block.content, block.props);
  pdf.setFontSize(12); // Reset font size
};

// Function to handle list items
const handleListItem = (pdf, block, type) => {
  if (typeof block.content === "object") {
    block.content.forEach((item) => {
      const listPrefix = item.type === "text" ? "• " : `${pageNumber}. `;
      addTextContent(pdf, `${listPrefix}${item.text}`);
    });
  } else {
    const listPrefix = type === "bullet" ? "• " : `${pageNumber}. `;
    addTextContent(pdf, `${listPrefix}${block.content}`);
  }
};

// Function to handle tables
const handleTable = (pdf, block) => {
  const tableRows = block.content.rows.map((row) => row.cells);
  autoTable(pdf, {
    startY: yOffset,
    head: [["Column 1", "Column 2", "Column 3"]],
    body: tableRows,
  });
  yOffset = pdf.autoTable.previous.finalY + 10; // Update yOffset after table
};

// Function to handle images
const handleImage = async (pdf, block) => {
  const imageProps = block.props;
  const img = await fetch(imageProps.url)
    .then((res) => res.blob())
    .then((blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });
  const imgWidth = usableWidth;
  const imgHeight = 150; // Set a fixed height for images
  if (yOffset + imgHeight > usableHeight) {
    addNewPage(pdf);
  }
  pdf.addImage(img, "JPEG", margin, yOffset, imgWidth, imgHeight);
  yOffset += imgHeight + 10; // Add some padding after the image
  addTextContent(pdf, imageProps.caption || ""); // Add image caption
};

// Function to handle media (audio/video)
const handleMedia = (pdf, block, type) => {
  const mediaType = type === "video" ? "Video URL" : "Audio URL";
  addTextContent(pdf, `${mediaType}: ${block.props.url}`);
  addTextContent(pdf, block.props.caption || "");
};

// Main function to convert blocks to PDF
export const exportToPDF = async (config, fileName) => {
  // console.log(config);
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

  for (const block of config) {
    switch (block.type) {
      case "paragraph":
        handleParagraph(pdf, block);
        break;
      case "heading":
        handleHeading(pdf, block);
        break;
      case "bulletListItem":
        handleListItem(pdf, block, "bullet");
        break;
      case "numberedListItem":
        handleListItem(pdf, block, "numbered");
        break;
      case "checkListItem":
        addTextContent(pdf, `[ ] ${block.content}`);
        break;
      case "table":
        handleTable(pdf, block);
        break;
      case "image":
        await handleImage(pdf, block);
        break;
      case "video":
        handleMedia(pdf, block, "video");
        break;
      case "audio":
        handleMedia(pdf, block, "audio");
        break;
      default:
        // Handle other cases like files, if needed
        break;
    }
  }

  // Add the final page number
  pdf.text(`Page ${pageNumber}`, pageWidth - margin - 50, pageHeight - margin + 10);

  // Save the PDF
  pdf.save(`${fileName}.pdf`);
  return `${fileName}.pdf`
};