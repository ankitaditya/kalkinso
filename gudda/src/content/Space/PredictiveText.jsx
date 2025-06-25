import React from 'react'
import { useState, useRef, useEffect } from "react";
import "./PredictiveText.css";
import { Button, IconButton } from '@carbon/react';
import { Attachment, Close, Image } from '@carbon/react/icons';

const PredictiveText = () => {
    const [userText, setUserText] = useState("");
    const [aiText, setAIText] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [placeholder, setPlaceholder] = useState("Type something to get AI suggestions...");

    const debounceTimeoutRef = useRef(null);
    const contentEditableRef = useRef(null);
    const fileInputRef = useRef(null);

    let enterPressed = false;

    useEffect(() => {
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
        }
    }, []);

    const fetchSuggestions = (text) => {
        if (text.trim().length) {
            setLoading(true);
            fetch(
                `https://www.kalkinso.com/api/kalkiai/suggestions?text=${encodeURIComponent(text)}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setAIText(data.aiResponse); // Update this line to match your JSON structure
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching AI text:", error);
                    setLoading(false);
                });
        }
    };

    const isCursorAtEnd = () => {
        const selection = window.getSelection();
        return selection.anchorOffset === selection.anchorNode.length;
    };

    const handleInput = (e) => {
        let newText = e.target.innerText;
        if (enterPressed && newText.endsWith("\n\n")) {
            // Remove the last newline character
            newText = newText.slice(0, -1);

            // Reset the flag
            enterPressed = false;
        }

        setUserText(newText);
        setAIText("");

        // Check if cursor is at the end
        if (isCursorAtEnd()) {
            // Debounce the API call
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(newText);
            }, 1500);
        }
    };

    const focusContentEditable = () => {
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
        }
    };

    const setCursorToEnd = (element) => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false); // false means collapse to end rather than the start
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const acceptSuggestion = () => {
        const contentEditableElement = contentEditableRef.current;
        if (aiText) {
            setUserText(userText + aiText);
            contentEditableElement.innerText = userText + aiText;
            setAIText("");
            setCursorToEnd(contentEditableElement);
        }
    };

    const handleKeyDown = (event) => {
        setPlaceholder("");
        if (event.key === "Tab") {
            event.preventDefault();
            acceptSuggestion();
        }

        if (event.key === "Enter") {
            // Set the flag to true when Enter is pressed
            enterPressed = true;

            // Allow the default Enter key behavior to occur
            setTimeout(() => {
                const contentEditableElement = contentEditableRef.current;
                const childNodes = Array.from(contentEditableElement.childNodes);

                // Find the last <br> element
                for (let i = childNodes.length - 1; i >= 0; i--) {
                    if (childNodes[i].nodeName === "BR") {
                        // Remove the last <br> element
                        contentEditableElement.removeChild(childNodes[i]);
                        break; // Exit the loop after removing the <br>
                    }
                }

                // Insert an empty text node with a zero-width space
                const emptyTextNode = document.createTextNode("\u200B");
                contentEditableElement.appendChild(emptyTextNode);

                // Set cursor after the empty text node
                setCursorToEnd(contentEditableElement);
            }, 0); // SetTimeout with delay of 0 to allow the stack to clear and the <br> to be inserted
        }
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length) {
            let image = new window.Image();
            image.src = URL.createObjectURL(files[0]);
            image.onload = () => {
                setImages([...images, image.src]);
            };
        }
    }

    return (
        <div className="flex flex-col place-items-center place-content-center h-screen">
            <label className='label'>Raise Your Mudda</label>
            <div
                onClick={focusContentEditable}
                className="p-4 border shadow cursor-text rounded-lg text-left w-[1200px] h-[200px] mx-auto overflow-auto"
                style={{ backgroundColor: "white" }}
            >
                <span
                    ref={contentEditableRef}
                    className="border-0 text-xs outline-none"
                    contentEditable={true}
                    suppressContentEditableWarning="true"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                >
                    {/* {userText} */}
                </span>

                <span
                    className={`text-xs text-gray-600 transition-opacity duration-500 ${(aiText || placeholder) ? "opacity-100" : "opacity-0"
                        }`}
                    contentEditable={false}
                >
                    {(aiText.length > 0 || placeholder.length>0) && (
                        <>
                            {placeholder? placeholder: aiText}
                            {aiText.length>0&&<span
                                onClick={() => {
                                    acceptSuggestion();
                                }}
                                className="border p-1.5 py-0.5 text-[10px] ml-1 inline-block w-fit rounded-md border-gray-300 cursor-pointer"
                            >
                                Tab
                            </span>}
                        </>
                    )}
                </span>
            </div>
            <div className="p-4 cursor-text rounded-lg text-right w-[1200px] overflow-auto">
            {images.map((image, index) => {
                return (
                    <div key={index} style={{
                        float: "left",
                        marginBottom: "5rem",
                        maxHeight: "50px",
                        marginRight: "5px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.4)",
                    }}>
                        <img
                            src={image}
                            alt="Uploaded"
                            // className="h-20 w-20 object-cover rounded-md"
                            onClick={() => {
                                setImages(images.filter((img, i) => i !== index));
                            }}
                            style={{ 
                                cursor: "pointer",
                                maxHeight: "50px",
                             }}
                        />
                        {/* <IconButton
                            kind='ghost'
                            style={{
                                top: "0",
                                right: "0",
                                position: "absolute",
                                borderRadius: "15px",
                            }}
                            onClick={() => {
                                setImages(images.filter((img, i) => i !== index));
                            }}
                            // className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white text-xs"
                        >
                            <Close />
                        </IconButton> */}
                    </div>
                )
               })}
            <IconButton
                kind="ghost"
                tooltipAlignment="center"
                title='Attach File'
                style={{
                    // background: "#10a37f",
                    color: "white",
                    borderRadius: "15px",
                    float: "right",
                }}
                onClick={()=>{
                    fileInputRef.current.click();
                }}
            >
                <Image />
                <input ref={fileInputRef} onChange={(e)=>handleFileUpload(e)} type="file" style={{display: 'none'}} />
            </IconButton>
            <Button
                    kind="ghost"
                    style={{
                        background: "#10a37f",
                        color: "white",
                        borderRadius: "15px",
                        float: "right",
                    }}
                    onClick={()=>{}}
                >
                    Post
            </Button>
            </div>
            <div className="text-xs h-10 text-gray-700 italic">
                {loading && <div>loading ai suggestions...</div>}
            </div>
        </div>
    );
}

export default PredictiveText