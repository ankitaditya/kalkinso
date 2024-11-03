
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import AWS from 'aws-sdk';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

AWS.config.update({ region: "ap-south-1" });

const ec2MetadataCredentials = new AWS.Credentials();
AWS.config.credentials = ec2MetadataCredentials;

export default function FileUploadWidget({emptyStateTemplate, item, key, bucket}) {
    const s3 = new AWS.S3({ params: { Bucket: 'kalkinso.com' } });
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    
    const onTemplateSelect = (e) => {
        // console.log(item)
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };
    
    const onTemplateUpload = (e) => {
        let _totalSize = totalSize;
        // console.log("I am in upload!")
        e.files.forEach((file) => {
            const params = {
                Bucket: bucket,
                Key: `${item.id}${file.name}`,
                Body: file,
                ContentType: file.type,
              };
            //   console.log(params)
              s3.upload(params, (err, data) => {
                if (err) {
                //   console.log(err);
                  toast.current.show({ severity: 'error', summary: 'Error', detail: 'File Upload Error' });
                }
                if (data) {
                //   console.log(data);
                  toast.current.show({ severity: 'success', summary: 'Success', detail: 'File Uploaded' });
                }
              }).on('httpUploadProgress', (progress) => {
                const value = progress.loaded / progress.total * file.size;
                setTotalSize(_totalSize-value);
                toast.current.show({ severity: 'info', summary: 'Info', detail: `${value}% Uploaded` });
              });
        });
        e.files = []
        setTotalSize(_totalSize>0?_totalSize:0);
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 2000000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 200 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap" style={{marginTop: "2rem"}}>
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                {emptyStateTemplate}
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div style={{marginTop:"2rem", marginBottom: "2rem"}}>
            <Toast style={{zIndex:9999999}} ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload ref={fileUploadRef} style={{marginTop:"2rem", marginBottom: "2rem"}} name="kits_upload" url='/api/kits/upload' multiple accept="*" maxFileSize={1000000*200}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}
        