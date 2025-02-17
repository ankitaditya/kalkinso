import React, { useState, useEffect } from "react";
import "@blocknote/core/fonts/inter.css";
import "./AIPromptEditor.css";
import { pkg, SidePanel, ActionBar, EditInPlace } from "@carbon/ibm-products";
import { TextArea, TextInput, Select, SelectItem, Button, usePrefix } from "@carbon/react";
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
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useComponentsContext,
  useBlockNoteEditor,
  blockTypeSelectItems,
  FormattingToolbarController,
} from "@blocknote/react";
import { BlockNoteSchema, defaultInlineContentSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import axios from "axios";
import katex from "katex";
import { marked } from "marked";
import {
  AddFilled,
  Download,
  MathCurve,
  Save,
  TrashCan,
} from "@carbon/react/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../actions/auth";

// Enable SidePanel components from Carbon
pkg.component.SidePanel = true;

/* -------------------------------------------------------------------------
   1. Inline Math Support
------------------------------------------------------------------------- */

const MathBlock = ({ content }) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    try {
      const renderedHtml = katex.renderToString(content.replace(/\$\$/g, ""), {
        throwOnError: false,
      });
      setHtml(renderedHtml);
    } catch (error) {
      console.error("Error rendering math:", error);
    }
  }, [content]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const mathBlockSpec = createReactInlineContentSpec(
  {
    type: "math",
    propSchema: {
      text: {
        default: "$$\\frac{a}{b}$$",
      },
    },
    content: "none",
  },
  {
    render: (props) => <MathBlock content={props.inlineContent.props.text} />,
  }
);

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    math: mathBlockSpec,
  },
});

/* -------------------------------------------------------------------------
   2. AI Prompt Generation Functionality
------------------------------------------------------------------------- */

const generateAiPrompt = async (inputPrompt, selectedText, previousContent) => {
  const promptTemplate = `
For my prompt, respond with detailed, professionally written text formatted in Markdown.
Here is my prompt: ${inputPrompt}
Selected Content: ${selectedText}
Previous Response: ${previousContent || ""}
  `;
  try {
    const response = await axios.post(
      "/api/kalkiai/completions",
      JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert text editor and writing assistant.",
          },
          {
            role: "user",
            content: promptTemplate,
          },
        ],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error generating AI prompt:", error);
    return null;
  }
};

/* -------------------------------------------------------------------------
   3. Toolbar Button Components
------------------------------------------------------------------------- */

function InlineMathButton() {
  const editor = useBlockNoteEditor({ schema });
  const Components = useComponentsContext();
  return editor ? (
    <Components.FormattingToolbar.Button
      mainTooltip="Convert to Inline Math"
      onClick={() => {
        const selectedText = editor.getSelectedText();
        if (/\$\$[^\$]+\$\$/.test(selectedText)) {
          editor.insertInlineContent([
            {
              type: "math",
              props: { text: selectedText },
            },
          ]);
        }
      }}
    >
      <MathCurve />
    </Components.FormattingToolbar.Button>
  ) : null;
}

function AiPromptButton() {
  const dispatch = useDispatch();
  const editor = useBlockNoteEditor({ schema });
  const Components = useComponentsContext();
  if (!editor) return null;

  const getPreviousContent = async () => {
    const cursorBlock = editor.getTextCursorPosition().block;
    const allBlocks = editor.document;
    const cursorIndex = allBlocks.findIndex((block) => block.id === cursorBlock.id);
    const previousBlocks = allBlocks.slice(0, cursorIndex);
    let previousContent = "";
    if (previousBlocks.length > 0) {
      previousContent = await editor.blocksToMarkdownLossy(previousBlocks);
    }
    return previousContent || "No previous content.";
  };

  const handleGenerateAiPrompt = async () => {
    const inputPrompt = prompt("Enter your AI prompt:");
    if (!inputPrompt) return;
    const selectedText = editor.getSelectedText();
    if (!selectedText) {
      alert("Please select some text.");
      return;
    }
    const previousContent = await getPreviousContent();
    const aiResult = await generateAiPrompt(inputPrompt, selectedText, previousContent);
    if (aiResult) {
      const currentBlock = editor.getTextCursorPosition().block;
      const newBlocks = await editor.tryParseMarkdownToBlocks(aiResult);
      editor.replaceBlocks([currentBlock], newBlocks);
    }
  };

  return (
    <Components.FormattingToolbar.Button
      mainTooltip="Generate AI Prompt"
      onClick={async () => {
        dispatch(setLoading(true));
        await handleGenerateAiPrompt();
        dispatch(setLoading(false));
      }}
    >
      AI Prompt
    </Components.FormattingToolbar.Button>
  );
}

function AddFileButton() {
  const editor = useBlockNoteEditor({ schema });
  const Components = useComponentsContext();
  return editor ? (
    <Components.FormattingToolbar.Button
      mainTooltip="Create New File"
      onClick={() => {
        editor.replaceBlocks(editor.document, []);
      }}
    >
      <AddFilled />
    </Components.FormattingToolbar.Button>
  ) : null;
}

/* -------------------------------------------------------------------------
   4. Main BlockNoteEditor Component with Book Preview, Metadata,
      and Auto-Save Toggle & Notifications
------------------------------------------------------------------------- */

export default function BlockNoteEditor({ initialContent, ...rest }) {
  const carbonPrefix = usePrefix();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("Untitled Document");
  const [wordCount, setWordCount] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  // --- Auto-Save State ---
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saveNotification, setSaveNotification] = useState("Saved");

  // --- SidePanel State for Book Preview & Metadata ---
  const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);
  const [bookMetaData, setBookMetaData] = useState({
    pageSize: "A4",
    title: "",
    author: "",
    description: "",
  });

  // State for preview HTML content
  const [previewContent, setPreviewContent] = useState("");

  // Define page size dimensions (example dimensions in pixels)
  const pageSizes = {
    A4: { width: "595px", height: "842px" },
    Letter: { width: "612px", height: "792px" },
    Legal: { width: "612px", height: "1008px" },
  };

  // Rename mapping for BlockTypeSelect.
  const rename = {
    "Heading 1": "Title",
    "Heading 2": "Subtitle",
    "Bullet List": "Index",
  };

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent
      ? Array.isArray(initialContent)
        ? initialContent
        : [{ type: "paragraph", content: initialContent }]
      : [{ type: "heading", content: "Write something..." }],
  });

  // Update word count and mark changes on editor content change.
  const handleEditorChange = async () => {
    if (editor) {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      const words = markdown
        .replace(/[#*_`>-]|\[.*?\]\(.*?\)/g, "")
        .split(/\s+/)
        .filter(Boolean);
      setWordCount(words.length);
      setIsChanged(true);
      // Update preview content by converting Markdown to HTML.
      setPreviewContent(marked(markdown));
    }
  };

  // Auto-save every 5 seconds if enabled.
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const interval = setInterval(() => {
      if (isChanged) {
        console.log("Auto-saving document:", fileName);
        setSaveNotification("Saving...");
        // Simulate auto-save delay
        setTimeout(() => {
          setSaveNotification("Saved");
          setIsChanged(false);
          // Clear notification after a short delay
          setTimeout(() => setSaveNotification("Saved"), 2000);
        }, 1000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isChanged, fileName, autoSaveEnabled]);

  return (
    <div style={{ margin: "2rem" }}>
      {/* Header with editable filename, word count, and auto-save toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
        }}
      >
        <EditInPlace
          value={fileName}
          onChange={setFileName}
          onSave={(newName) => setFileName(newName)}
        />
        <div style={{ marginLeft: "auto" }}>Word Count: {wordCount}</div>
        <Button
          size="small"
          kind="ghost"
          onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
        >
          {autoSaveEnabled ? "Disable Auto-Save" : "Enable Auto-Save"}
        </Button>
      </div>
      {/* Save Notification */}
      {saveNotification && (
        <div style={{ marginBottom: "1rem", color: "#0072C3" }}>
          {saveNotification}
        </div>
      )}

      {/* ActionBar with Save, Download, Delete, Preview & Metadata actions */}
      <ActionBar
        actions={[
          {
            id: "save",
            key: "save",
            renderIcon: () => <Save />,
            label: "Save",
            onClick: () => {
              console.log("Saving document:", fileName);
              setSaveNotification("Saving...");
              setTimeout(() => {
                setSaveNotification("Saved");
                setIsChanged(false);
                setTimeout(() => setSaveNotification("Saved"), 2000);
              }, 1000);
            },
            disabled: !isChanged,
          },
          {
            id: "download",
            key: "download",
            renderIcon: () => <Download />,
            label: "Download",
            onClick: () => {
              console.log("Downloading document:", fileName);
            },
          },
          {
            id: "delete",
            key: "delete",
            renderIcon: () => <TrashCan />,
            label: "Delete",
            onClick: () => {
              console.log("Deleting document:", fileName);
              navigate("/tools/home");
            },
          },
          {
            id: "preview",
            key: "preview",
            renderIcon: () => <span role="img" aria-label="preview">👁</span>,
            label: "Preview & Metadata",
            onClick: () => setIsPreviewPanelOpen(true),
          },
        ]}
        rightAlign={true}
        containerWidth={800}
        style={{ marginBottom: "1rem" }}
      />

      {/* The BlockNote editor view */}
      <BlockNoteView
        editable={true}
        theme="light"
        editor={editor}
        formattingToolbar={false}
        onChange={handleEditorChange}
        {...rest}
      >
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <AddFileButton />
              <BlockTypeSelect
                items={blockTypeSelectItems(editor.dictionary).map((val) => ({
                  ...val,
                  name: rename[val.name] ? rename[val.name] : val.name,
                }))}
              />
              <InlineMathButton />
              <AiPromptButton />
              <FileCaptionButton />
              <FileReplaceButton />
              <BasicTextStyleButton basicTextStyle="bold" />
              <BasicTextStyleButton basicTextStyle="italic" />
              <BasicTextStyleButton basicTextStyle="underline" />
              <BasicTextStyleButton basicTextStyle="strike" />
              <BasicTextStyleButton basicTextStyle="code" />
              <TextAlignButton textAlignment="left" />
              <TextAlignButton textAlignment="center" />
              <TextAlignButton textAlignment="right" />
              <ColorStyleButton />
              <NestBlockButton />
              <UnnestBlockButton />
              <CreateLinkButton />
            </FormattingToolbar>
          )}
        />
      </BlockNoteView>

      {/* SidePanel for Book Preview & Metadata */}
      <SidePanel
        id="book-preview-panel"
        title="Book Preview & Metadata"
        subtitle="Customize page size and add metadata"
        open={isPreviewPanelOpen}
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        size="xl"
        onRequestClose={() => setIsPreviewPanelOpen(false)}
        onRequestSubmit={() => {
          console.log("Book Meta Data:", bookMetaData);
          setIsPreviewPanelOpen(false);
        }}
        selectorPrimaryFocus={`.${carbonPrefix}--text-input`}
      >
        <div className="book-preview-form" style={{ padding: "1rem" }}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="page-size-select">Page Size</label>
            <Select
              id="page-size-select"
              value={bookMetaData.pageSize}
              onChange={(e) =>
                setBookMetaData({ ...bookMetaData, pageSize: e.target.value })
              }
            >
              <SelectItem value="A4" text="A4" />
              <SelectItem value="Letter" text="Letter" />
              <SelectItem value="Legal" text="Legal" />
            </Select>
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <TextInput
              id="book-title"
              labelText="Book Title"
              value={bookMetaData.title}
              onChange={(e) =>
                setBookMetaData({ ...bookMetaData, title: e.target.value })
              }
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <TextInput
              id="book-author"
              labelText="Author"
              value={bookMetaData.author}
              onChange={(e) =>
                setBookMetaData({ ...bookMetaData, author: e.target.value })
              }
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <TextArea
              id="book-description"
              labelText="Description"
              value={bookMetaData.description}
              onChange={(e) =>
                setBookMetaData({ ...bookMetaData, description: e.target.value })
              }
              rows={4}
            />
          </div>
          {/* Book preview area: white background "page" showing formatted content */}
          <div
            className="book-preview"
            style={{
              marginTop: "1rem",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              padding: "1rem",
              width: pageSizes[bookMetaData.pageSize].width,
              height: pageSizes[bookMetaData.pageSize].height,
              overflow: "auto",
            }}
          >
            <h2>{bookMetaData.title || "Book Title"}</h2>
            <p>
              <strong>Author: </strong>
              {bookMetaData.author || "Author Name"}
            </p>
            <p>
              {bookMetaData.description || "Book description will appear here."}
            </p>
            <div>
              <strong>Content Preview:</strong>
              <div
                style={{
                  border: "1px dashed #999",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: previewContent }} />
              </div>
            </div>
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
