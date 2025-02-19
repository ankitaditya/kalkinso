import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const PDFViewer = ({ file }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div
            style={{
                height: '750px',
                width: '100%',
            }}
        >
            <Viewer
                fileUrl={file}
                plugins={[
                    defaultLayoutPluginInstance,
                ]}
            />
        </div>
        </Worker>
    );
}

export default PDFViewer;