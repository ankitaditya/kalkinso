import { Modal } from "@carbon/react";
import { useState } from "react";

export default function DeleteModal({ open, setOpen, onDelete }) {
    const [status, setStatus] = useState('inactive');
    const [description, setDescription] = useState('Deleting...');
    const submit = async () => {
      setStatus('active');
      onDelete();
      setDescription('Deleted!');
      setStatus('finished');
    };
    const resetStatus = () => {
      setStatus('inactive');
      setDescription('Deleting...');
    };
    return <Modal open={open} onRequestClose={() => setOpen(false)} danger modalHeading="Are you sure you want to delete?" modalLabel="Account resources" primaryButtonText="Delete" secondaryButtonText="Cancel" onRequestSubmit={submit} loadingStatus={status} loadingDescription={description} onLoadingSuccess={resetStatus} />;
  }