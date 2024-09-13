import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import axios from 'axios';
 
export default function BlockNoteEditor({initialContent}) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent:initialContent?[{ type: "paragraph", content: "Loading..." }]:[{ type: "paragraph", content: "Type an Idea" }],
  });
  
  useEffect(() => {
    if(initialContent){
        axios.get(initialContent).then(async (res) => {
          const blocks = await editor.tryParseMarkdownToBlocks(res.data);
          editor.replaceBlocks(editor.document, blocks);
        });
    }
  }, [initialContent]);
  
  useEffect(() => {
    if(editor){
      console.log("Editor created: ", editor);
    }
  }, [editor]);

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}
 