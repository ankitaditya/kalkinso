import { EditInPlace } from "@carbon/ibm-products";
import { Modal, TextInput } from "@carbon/react";
import { useState } from "react";

export default function InsertModal({ open, defaultFolderPath, setOpen, onAdd }) {
    const [status, setStatus] = useState('inactive');
    const [description, setDescription] = useState('Adding...');
    const [ fileName, setFileName ] = useState('');
    const [ folderPath, setFolderPath ] = useState(defaultFolderPath.split('/').slice(2).join('/'));
    const submit = async () => {
      setStatus('active');
      onAdd(defaultFolderPath.split('/').slice(0,2).join('/')+'/'+folderPath+fileName);
      setTimeout(() => {
        setDescription('Added!');
        setStatus('finished');
        setFileName('');
        setOpen(false);
      }, 2000);
    };
    const resetStatus = () => {
      setStatus('inactive');
      setDescription('Adding...');
    };
    return <Modal open={open} onRequestClose={() => setOpen(false)} modalHeading={<EditInPlace value={folderPath.slice(-1)!=='/'?folderPath+'/':folderPath} onChange={(value)=>{setFolderPath(value)}} onCancel={()=>setFolderPath(defaultFolderPath.split('/').slice(2).join('/'))} />} modalLabel="Account resources" primaryButtonText="Add" secondaryButtonText="Cancel" onRequestSubmit={submit} loadingStatus={status} loadingDescription={description} onLoadingSuccess={resetStatus}>
                <TextInput value={fileName} data-modal-primary-focus id="text-input-1" labelText="File Name" onChange={(e)=>setFileName(e.target.value)} placeholder="e.g. example.txt, example.js" />
            </Modal>;
  }