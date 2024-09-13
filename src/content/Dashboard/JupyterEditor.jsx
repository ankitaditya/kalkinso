// src/Notebook.js
import React, { useState, useEffect } from 'react';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { useRef } from 'react';

const CodeCell = ({ pyodide }) => {
  const [output, setOutput] = useState('');
  const editorRef = useRef();

  useEffect(() => {
    if (!editorRef.current) return;
    const startState = EditorState.create({
      doc: '',
      extensions: [basicSetup, python(), oneDark],
    });
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });
    editorRef.current.view = view;
  }, []);

  const runCode = async () => {
    if (!pyodide) {
      setOutput('Pyodide is still loading...');
      return;
    }
    const code = editorRef.current.view.state.doc.toString();
    try {
      const result = await pyodide.runPythonAsync(code);
      setOutput(result === undefined ? 'Code executed.' : result.toString());
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div ref={editorRef} style={{ border: '1px solid #ccc' }} />
      <button onClick={runCode} style={{ marginTop: '10px' }}>
        Run
      </button>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '10px',
          marginTop: '10px',
        }}
      >
        {output}
      </pre>
    </div>
  );
};

const JupyterEditor = () => {
  const [pyodide, setPyodide] = useState(null);
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await window.loadPyodide({
        stdout: console.log,
        stderr: console.error,
      });
      setPyodide(pyodideInstance);
    };
    loadPyodide();
  }, []);

  const addCell = () => {
    setCells([...cells, {}]);
  };

  return (
    <iframe title="jupyter" src="https://coderush.vercel.app/" style={{ width: '100%', height: '65vh' }} />
  );
};

export default JupyterEditor;
