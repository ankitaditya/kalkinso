/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { FormItem, FileUploaderDropContainer, FileUploaderItem } from '@carbon/react';
import { useSelector } from 'react-redux';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const prefix = 'cds';

// -- copied from internal/tools/uniqueId.js
let lastId = 0;
function uid(prefix = 'id') {
  lastId++;
  return `${prefix}${lastId}`;
}
// -- end copied

const FileUploaderDragAndDrop = (props) => {
  const [files, setFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState(props?.attachments?props?.attachments?.map((val)=>{
    return {
      uuid: val?._id,
      name: val?.url?.split('/')?.pop(),
      filesize: 0,
      status: 'complete',
      iconDescription: 'Upload complete',
      invalidFileType: false,
    }
  }):[]);
  const profile = useSelector((state) => state.profile);
  useEffect(() => {
    if(files.length>0){
        // console.log("This is files in setattachments: ",files);
        props.setattachments(files);
    }
  }, [files]);

  useEffect(() => {
        // setFiles(props?.attachments?props?.attachments:[]);
        setTempFiles(props?.attachments?props?.attachments?.map((val)=>{
          return {
            uuid: val?._id,
            name: val?.url?.split('/')?.pop(),
            filesize: 0,
            status: 'complete',
            iconDescription: 'Upload complete',
            invalidFileType: false,
          }
        }):[]);
    }, [props?.attachments]);

  const uploaderButton = useRef(null);
  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragover = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragover);
    return () => {
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragover);
    };
  }, []);

  const uploadFile = async (fileToUpload, addedFile) => {
    // file size validation
    // console.log("This is file to upload: ",fileToUpload);
    if (fileToUpload.filesize > (1024*1024*5)) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '5 max file size. Select a new file and try again.',
      };
      setTempFiles((tempFiles) =>
        tempFiles.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // file type validation
    if (fileToUpload.invalidFileType) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${fileToUpload.name}" does not have a valid file type.`,
      };
      setTempFiles((tempFiles) =>
        tempFiles.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // simulate network request time
    
    const rand = Math.random() * 1000;
      AWS.config.update({
        accessKeyId: "AKIA6GBMDGBC6SGUYGUC",
        secretAccessKey: "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",
      });
      const s3 = new S3({
        params: { Bucket: 'kalkinso.com' },
        region: 'ap-south-1',
      });
      const params = {
        Bucket: 'kalkinso.com',
        Key: `users/${profile.user}/temp/attachments/${addedFile.name}`,
        Body: addedFile,
      };
      s3.putObject(params).promise().then((data) => {
        // console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}: ${data}`);
        const updatedFile = {
          ...fileToUpload,
          status: 'complete',
          iconDescription: 'Upload complete',
        };
        setTempFiles((tempFiles) =>
          tempFiles.map((file) =>
            file.uuid === fileToUpload.uuid ? updatedFile : file
          )
        );
        setFiles([...files, {Bucket: params.Bucket, Key: params.Key}]);
      }).catch((err) => {
        // console.log(err, err.stack);
        const updatedFile = {
          ...fileToUpload,
          status: 'edit',
          iconDescription: 'Upload incomplete',
        };
        setTempFiles((tempFiles) =>
          tempFiles.map((file) =>
            file.uuid === fileToUpload.uuid ? updatedFile : file
          )
        );
      });

    // show x icon after 1 second
    setTimeout(() => {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
      };
      setTempFiles((tempFiles) =>
        tempFiles.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
    }, rand + 1000);
  };

  const onAddFiles = useCallback(
    (evt, { addedFiles }) => {
      evt.stopPropagation();
      // AWS.config.update({
      //   accessKeyId: "AKIA6GBMDGBC5LFG7IUW",
      //   secretAccessKey: "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",
      // });
      // const s3 = new S3({
      //   params: { Bucket: 'kalkinso.com' },
      //   region: 'ap-south-1',
      // });
      let file = document.getElementById('file-uploader-input');
      // const params = {
      //   Bucket: 'kalkinso.com',
      //   Key: `${profile._id}/temp/attachments/${addedFiles[0].name}`,
      //   Body: addedFiles[0],
      // };
      // s3.putObject(params).promise().then((data) => {
      //   console.log(`Successfully uploaded data to ${params.Bucket}/${params.Key}: ${data}`);
      // }).catch((err) => {
      //   console.log(err, err.stack);
      // });
      // props.setattachments(addedFiles);
      // console.log("This is added files: ",file.files[0]);
      // console.log("This is added events: ",file.value);
      const newFiles = addedFiles.map((file) => ({
        uuid: uid(),
        name: file.name,
        filesize: file.size,
        status: 'uploading',
        iconDescription: 'Uploading',
        invalidFileType: file.invalidFileType,
      }));
      // eslint-disable-next-line react/prop-types
      if (props.multiple) {
        // setFiles(addedFiles);
        setTempFiles(newFiles);
        newFiles.forEach((file, index)=>uploadFile(file, addedFiles[index]));
      } else if (addedFiles[0]) {
        // setFiles([addedFiles[0]]);
        uploadFile(newFiles[0], addedFiles[0]);
        setTempFiles(newFiles[0]);
      }
    },
    // eslint-disable-next-line react/prop-types
    [files, props.multiple,tempFiles]
  );

  const handleFileUploaderItemClick = useCallback(
    (_, { uuid: clickedUuid }) => {
      uploaderButton.current.focus();
      // console.log("This is clicked uuid: ",uploaderButton);
      return setTempFiles(tempFiles.filter(({ uuid }) => clickedUuid !== uuid));
    },
    [tempFiles]
  );

  const labelClasses = classnames(`${prefix}--file--label`, {
    // eslint-disable-next-line react/prop-types
    [`${prefix}--file--label--disabled`]: props.disabled,
  });

  const helperTextClasses = classnames(`${prefix}--label-description`, {
    // eslint-disable-next-line react/prop-types
    [`${prefix}--label-description--disabled`]: props.disabled,
  });

  return (
    <FormItem>
      <p className={labelClasses}>{props.disableTextLabel?"":"Attachments"}</p>
      <p className={helperTextClasses}>
        {props.disableTextLabel?"":"Max file size is 5. Supported file types are"}
      </p>
        <p className={helperTextClasses}>{props.disableTextLabel?"":props.accept.join(', ')}</p>
      <FileUploaderDropContainer
        // {...props}
        id='file-uploader-input'
        name='file-uploader-input'
        labelText={props.labelText}
        accept={props.accept}
        multiple={props.multiple}
        onAddFiles={onAddFiles}
        // onChange={(event) => {console.log("This is event: ",event)}}
        innerRef={uploaderButton}
      />
      <div
        className={classnames(
          `${prefix}--file-container`,
          `${prefix}--file-container--drop`
        )}>
        {tempFiles.map(
          ({
            uuid,
            name,
            filesize,
            status,
            iconDescription,
            invalid,
            ...rest
          }) => (
            uuid?<FileUploaderItem
              key={uid()}
              uuid={uuid}
              name={name}
              filesize={filesize}
              // eslint-disable-next-line react/prop-types
              size={props.size}
              status={status}
              iconDescription={iconDescription}
              invalid={invalid}
              onDelete={handleFileUploaderItemClick}
              {...rest}
            />:<></>
          )
        )}
      </div>
    </FormItem>
  );
};

export default FileUploaderDragAndDrop;
