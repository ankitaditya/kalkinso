import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Carbon & React Chat Elements
import {
  Button,
  TextArea,
  Tile,
  InlineNotification,
  ClickableTile,
  Grid,
  Column,
  Loading,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  ButtonSet,
  IconButton,
  ActionableNotification, // For the trash icon or you can use <Button> with renderIcon
} from "@carbon/react";
import {
  Send,
  Attachment,
  Image,
  Gears,
  Checkmark,
  TrashCan, // NEW: for the delete icon
} from "@carbon/icons-react";
import { Button as ChatButton, Input } from "react-chat-elements";

// PrimeReact Editor
import { Editor } from "primereact/editor";

// For rendering Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Edit, Save } from "@carbon/icons-react";

import { ProductiveCard, pkg } from "@carbon/ibm-products";
// Make sure you have installed @carbon/ibm-products
// or remove references if not used in your code

// Redux placeholders (if you need them)
import { useDispatch, useSelector } from "react-redux";
import { addTask, setIsMulti, setOpenTask } from "../../../actions/task";
import { setLoadingMessage } from "../../../actions/kalkiai";
import AIPromptEditor from "./AIPromptEditor";

import "./Build.scss"; // your SCSS
import GoogleLoginButton from "../../Login/GoogleLoginButton";

pkg.component.ProductiveCard = true; // enables ProductiveCard if needed

// Example createTaskTemplate from your ChatScreen code
const createTaskTemplate = {
  user: {},
  name: "",
  description: "",
  assigned: [
    {
      user: "1234-user-id",
      status: "To Do",
      isVolunteer: false,
      rating: 5,
    },
  ],
  time: {
    estimated: [{ user: "1234-user-id", value: 4 }],
    actual: {},
  },
  cost: { estimated: 100, actual: 100 },
  org: "my-org-id",
  location: "Online",
  status: "To Do",
  skills: [],
  analytics: {},
  priority: "",
  subTasks: [],
  parentTasks: [],
  attachments: [],
  tags: [],
  date: new Date().toLocaleDateString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const suggestionPrompts = [
  "I have a business idea I'd like to explore",
  "Help me start a new business",
  "I want to learn more about Kalkinso's services",
  "Can you help me with AI implementation?",
  "I need assistance with project planning",
  "Show me how to use Kalkinso's tools",
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const Build = () => {
  const dispatch = useDispatch();

  // If you have tasks in Redux:
  const { tasks } = useSelector((state) => state.task) || {};

  // Multi-session state in local storage
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Input form state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Track content from Editor (for AI responses that are recognized as text editor content)
  const [quillInstance, setQuillInstance] = useState("");
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);

  // Additional states for the "task visualizer"
  const [createdTask, setCreatedTask] = useState({});
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [narrowTearsheetOpen, setNarrowTearsheetOpen] = useState(false);
  const [wideTearsheetOpen, setWideTearsheetOpen] = useState(false);
  const [multiStepTearsheetOpen, setMultiStepTearsheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editedText, setEditedText] = useState("");

  // For advanced UI config (like from ChatScreen):
  const [componentConfig, setComponentConfig] = useState({
    createTearsheet: {
      title: "Create task",
      label: "Multi-step tearsheet label",
      nextButtonText: "Next step",
      description: "Specify details for the new task you want to create",
      submitButtonText: "Create",
      cancelButtonText: "Cancel",
      backButtonText: "Back",
    },
  });

  // NEW: Reference to a hidden file input for image upload
  const fileInputRef = useRef(null);

  // -----------------------------
  // Load sessions from localStorage on mount
  // -----------------------------
  useEffect(() => {
    const stored = localStorage.getItem("chatSessions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed);

      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    } else {
      // create a default session
      const defaultSession = {
        id: generateId(),
        title: "New Chat Session",
        messages: [
          {
            role: "assistant",
            content:
              "Hello there! I am an assistant for your idea implementation. You can generate tasks, create plans, and more. How can I help you today?",
          },
        ],
        createdAt: new Date().toLocaleString(),
      };
      setSessions([defaultSession]);
      setActiveSessionId(defaultSession.id);
      localStorage.setItem("chatSessions", JSON.stringify([defaultSession]));
    }
  }, []);

  // -----------------------------
  // Save sessions to localStorage whenever sessions changes
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Helper: Return the active session object
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // -----------------------------
  // Switch sessions from the left sidebar
  // -----------------------------
  const handleSessionClick = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  // -----------------------------
  // Create a new session
  // -----------------------------
  const handleNewSession = () => {
    const newSession = {
      id: generateId(),
      title: `Session ${sessions.length + 1}`,
      messages: [
        {
          role: "assistant",
          content:
            "Hello! This is a new session. What would you like to discuss?",
        },
      ],
      createdAt: new Date().toLocaleString(),
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
  };

  // -----------------------------
  // NEW: Delete a session
  // -----------------------------
  const handleDeleteSession = (event, sessionId) => {
    event.stopPropagation(); // prevent session click
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);

    // If the active session was deleted, select another if available
    if (activeSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        setActiveSessionId(updatedSessions[0].id);
      } else {
        setActiveSessionId(null);
      }
    }
  };

  // Prompt templates
const businessPlanPromptTemplate = `You are a professional business plan builder. A user has provided the following request:

"{{USER_REQUEST}}"

Please convert this request into a comprehensive business plan. Your plan should include the following sections:
  
1. **Executive Summary**  
   Provide a high-level overview of the business idea, its purpose, and goals.

2. **Business Description & Vision**  
   Describe the business concept, the target market, and the long-term vision.

3. **Market Analysis**  
   Include market research, target audience, competitors, and unique selling points.

4. **Marketing Strategy**  
   Outline how the business will attract and retain customers, including channels and tactics.

5. **Operations Plan**  
   Detail the day-to-day operations, resources needed, and logistics.

6. **Financial Projections**  
   Provide estimated revenue, costs, and profitability. Include financial forecasts (e.g., estimated earnings).

Ensure your business plan is detailed, actionable, and professional.`;

const taskConversionPromptTemplate = `Now, based on the business plan generated above, please convert the plan into a hierarchical task list for project execution. For each task, include the following attributes:

- **Task Name**: A brief title for the task.
- **Description**: A detailed explanation of the task.
- **Estimated Time**: How long (in hours) the task is expected to take.
- **Estimated Cost**: The projected cost associated with the task.
- **Estimated Earning**: The potential earnings or financial benefit (if applicable).
- **Assignment**: Specify whether this task should be performed by an "AITool" (automated process) or a "Human" (manual effort). Include the name where applicable.

Organize the tasks in a clear hierarchical structure, with main tasks and nested sub-tasks, ensuring that each task is actionable and aligned with the business plan.`;


  // -----------------------------
  // Send message -> get AI response
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeSession || !input.trim() || isLoading) return;
  
    const userMessage = input.trim();
    setInput("");
    dispatch(setLoadingMessage(true));
    setIsLoading(true);
  
    // Add the new user message to the active session
    const updatedSessions = sessions.map((session) => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            { role: "user", content: userMessage },
          ],
        };
      }
      return session;
    });
    setSessions(updatedSessions);
  
    // Get the current session (with the new user message)
    const currentSession = updatedSessions.find(
      (session) => session.id === activeSessionId
    );
    // Build conversation history: include all messages (both user and assistant)
    const conversationHistory = currentSession ? currentSession.messages : [];
  
    // Choose the prompt template based on the user message.
    // If the message includes "turn it into task", use the task conversion prompt;
    // otherwise, substitute the user request into the business plan template.
    let promptTemplate = "";
    if (userMessage.toLowerCase().includes("turn it into task")) {
      promptTemplate = taskConversionPromptTemplate;
    } else {
      promptTemplate = businessPlanPromptTemplate.replace(
        "{{USER_REQUEST}}",
        userMessage
      );
    }
  
    try {
      // Call the text-generation API using the conversation history as context,
      // and append an extra user message with the prompt template.
      const response = await axios.post(
        "/api/kalkiai/completions",
        JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert text editor and business plan builder.",
            },
            ...conversationHistory,
            { role: "user", content: promptTemplate },
          ],
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Suppose the API returns the assistant's reply in response.data.result.
      const assistantReply = response?.data?.result || "No content returned.";
  
      // Check if the assistant reply is JSON (e.g. for task cards) or plain text.
      let newMessage;
      try {
        const parsed = JSON.parse(assistantReply);
        if (parsed && parsed.project_name) {
          // Likely a card object from task conversion.
          newMessage = {
            role: "assistant",
            content: "Here is a generated task plan:",
            cards: [parsed],
          };
        } else {
          newMessage = {
            role: "assistant",
            content: assistantReply,
          };
        }
      } catch (err) {
        newMessage = {
          role: "assistant",
          content: assistantReply,
        };
      }
  
      // Insert the assistant's message into the active session.
      const finalSessions = updatedSessions.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, newMessage],
          };
        }
        return session;
      });
      setSessions(finalSessions);
    } catch (err) {
      console.error("Error calling text-generation API:", err);
      // Fallback error message.
      const errorMessage = {
        role: "assistant",
        content: "Please sign in to access this feature.",
        sign_in: true,
      };
      const errorSessions = updatedSessions.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
          };
        }
        return session;
      });
      setSessions(errorSessions);
    } finally {
      setIsLoading(false);
      dispatch(setLoadingMessage(false));
    }
  };
  
  

  // -----------------------------
  // NEW: Handle image upload
  // -----------------------------
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demonstration, we convert the image to base64 and store it as a user message.
    // In a real app, you'd likely upload to your server or S3, then store the URL.
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      // Add as a new user message
      if (activeSession) {
        const updatedSessions = sessions.map((session) => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [
                ...session.messages,
                {
                  role: "user",
                  content: `![UserImage](${base64Data})`, // inline markdown image
                },
              ],
            };
          }
          return session;
        });
        setSessions(updatedSessions);
      }
    };
    reader.readAsDataURL(file);
  };

  // -----------------------------
  // Rendering a single message
  // -----------------------------
  const renderMessage = (message, idx, allMessages) => {
    // 1) Identify the index of the last assistant message
    //    We'll find the highest index where role==='assistant'
    const lastAssistantIndex = [...allMessages]
      .map((m, i) => (m.role === "assistant" ? i : -1))
      .reduce((acc, val) => (val > acc ? val : acc), -1);
  
    // Check if THIS message is that last assistant
    const isLastAssistant = idx === lastAssistantIndex && message.role === "assistant";

    if (message.sign_in) {
      return (
        <ActionableNotification
          key={idx}
          kind="info"
          hideCloseButton={true}
          style={{ maxWidth: "100%" }}
        >
          <p style={{ color: "white" }}>{message.content}</p>
          <ButtonSet>
          <Button
            kind="secondary"
            onClick={()=>{
              window.location.href = "/#/login"
            }}
          >
            Sign in
          </Button>
          <GoogleLoginButton />
          </ButtonSet>
        </ActionableNotification>
      );
    }
  
    // If it has "cards", show the "task visualizer" you already have
    if (message?.cards) {
      return (
        <Tile key={idx} className="assistant-tile">
          <strong>Kalkinso AI</strong>
          <p>{message.content}</p>
          {/* (Same code for ExpandableTile / ProductiveCard etc.) */}
          {/* ... */}
        </Tile>
      );
    }
  
    // 2) If normal text-like message => check if this is the assistant + last assistant
    // 3) If it's an assistant message (no cards)
  if (message.role === "assistant") {
    if (isLastAssistant) {
      // The last assistant message with edit/save icons in top-right
      return (
        <Tile key={idx} className="assistant-tile" style={{ position: "relative" }}>
          <strong>Kalkinso AI</strong>

          {/* Show Editor if isEditing; otherwise, ReactMarkdown */}
          {isEditing ? (
            <AIPromptEditor 
              initialContent={editedText || message.content}
              bucket={'kalkinso.com'}
              item_id={`users/tools/chat/${activeSessionId}/messages/${idx}.txt`}
              markdown={true}
            />
            // <Editor
            //   value={editedText || message.content}
            //   onLoad={(editor) => {
            //     // If not set, initialize
            //     if (editor && !editedText) {
            //       setEditedText(message.content || "");
            //     }
            //   }}
            //   onTextChange={(e) => setEditedText(e.htmlValue)}
            //   readOnly={false}
            // />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}

          {/* Icons in the top-right corner */}
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            {!isEditing ? (
              <IconButton
                kind="ghost"
                size="sm"
                label="Edit message"
                iconDescription="Edit message"
                onClick={() => {
                  setIsEditing(true);
                  setEditedText(message.content || "");
                }}
                renderIcon={Edit}
              />
            ) : (
              <IconButton
                kind="ghost"
                size="sm"
                label="Save message"
                iconDescription="Save message"
                onClick={() => {
                  // Save the edited text
                  message.content = editedText;
                  setIsEditing(false);
                }}
                renderIcon={Save}
              />
            )}
          </div>
        </Tile>
      );
    } else {
      // An older assistant message => always read-only
      return (
        <Tile key={idx} className="assistant-tile">
          <strong>Kalkinso AI</strong>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </Tile>
      );
    }
  }

  // 4) If it's a user message
  return (
    <Tile key={idx} className="user-tile">
      <strong>You</strong>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
    </Tile>
  );
};

useEffect(() => {
  // If the active session has more than one message, collapse the suggestions by default.
  if (activeSession && activeSession.messages && activeSession.messages.length > 1) {
    setSuggestionsExpanded(false);
  } else {
    setSuggestionsExpanded(true);
  }
}, [activeSession]);

  return (
    <Grid className="build-container" style={{ minHeight: "80vh" }}>
      {/* Left Column: sessions */}
      <Column lg={4} md={2} sm={4} className="left-column">
        <div className="history-container">
          <Button onClick={handleNewSession} style={{ marginBottom: "1rem" }}>
            + New Session
          </Button>
          {sessions.map((session) => (
            <ClickableTile
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={
                session.id === activeSessionId ? "active-tile" : "inactive-tile"
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>{session.title}</strong>
                {/* NEW: Delete icon */}
                <IconButton
                  kind="ghost"
                  label="Delete session"
                  iconDescription="Delete session"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  renderIcon={TrashCan}
                  size="sm"
                />
              </div>
              <p>
                <em>{session.createdAt}</em>
              </p>
              {session.messages.length > 0 && (
                <p style={{ marginTop: "0.5rem" }}>
                  {session.messages[session.messages.length - 1].content.slice(
                    0,
                    40
                  )}
                  {session.messages[session.messages.length - 1].content
                    .length > 40 && "..."}
                </p>
              )}
            </ClickableTile>
          ))}
        </div>
      </Column>

      {/* Right Column: chat area */}
      <Column lg={12} md={6} sm={4} className="chat-column">
        <Loading active={isLoading} />

        {/* Messages */}
        <div className="messages-container">
          {activeSession
            ? activeSession.messages.map((msg, idx) => renderMessage(msg, idx, activeSession.messages))
            : null}
        </div>

        <div className="suggestions-container" style={{ border: "1px solid #ccc", padding: "0.5rem", borderRadius: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>Suggestions:</p>
            <Button
              kind="ghost"
              size="small"
              onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
            >
              {suggestionsExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
          {suggestionsExpanded && (
            <div className="suggestion-buttons" style={{ marginTop: "0.5rem" }}>
              {suggestionPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  size="small"
                  kind="secondary"
                  onClick={() => setInput(prompt)}
                  style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form-container">
        <div style={{ width: "100%", margin: "20px 0" }}>
          <TextArea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem"
            }}
          >
            <Button
              kind="ghost"
              renderIcon={Attachment}
              iconDescription="Attachment"
              onClick={() => {}}
            >
              Attachment
            </Button>
            <Button
              kind="ghost"
              renderIcon={Image}
              iconDescription="Image"
              onClick={handleImageClick}
            >
              Image
            </Button>
            {/* Hidden file input for image upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Button
              kind="ghost"
              renderIcon={Gears}
              iconDescription="Tools"
              onClick={() => {}}
            >
              Tools
            </Button>
            <Button
              type="submit"
              renderIcon={Send}
              iconDescription="Send"
              style={{ marginLeft: "auto" }}
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </form>

      </Column>

      {/* Example: If you want to keep the tearsheets and sidepanel from your ChatScreen */}
      {/*
      <MultiStepTearsheetWide
        cards={tasks}
        isOpen={multiStepTearsheetOpen}
        setIsOpen={setMultiStepTearsheetOpen}
        componentConfig={componentConfig.createTearsheet}
        actions={{ setSidePanelOpen, setCardToEdit }}
      />
      {cardToEdit !== undefined && (
        <SidePanel
          data={tasks[cardToEdit]}
          actions={{ setSidePanelOpen }}
          index={cardToEdit}
          cards={tasks}
          isOpen={sidePanelOpen}
          setIsOpen={setSidePanelOpen}
          componentConfig={componentConfig}
        />
      )}
      */}
    </Grid>
  );
};

export default Build;
