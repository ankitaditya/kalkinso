import React, { useState } from 'react';
import axios from 'axios';
import {
  Form,
  TextInput,
  TextArea,
  Button,
  FileUploaderDropContainer,
  FileUploaderItem,
} from '@carbon/react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { addTask } from '../../actions/task';

const Reports = () => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState({});   
  const [createValues, setCreateValues] = useState({
    "user": {
      "first_name": "Abhishek",
      "last_name": "Shukla",
      "email": "abhishekshukla.shuklaabhishek@gmail.com",
      "mobile": "8953399459",
      "upi": "1b70d1",
      "adhar": "04f7f998-df4",
      "terms_conditions":  "true",
      "avatar": "//www.gravatar.com/avatar/82caf8ce1dd92298fa874e41ac691095?s=200&r=pg&d=mm",
      "date": "2024-12-28T10:04:05.782+00:00"
    },
    "name": "",
    "description": "",
    "short_description": "",
    "assigned": [],
    "time": {
    "estimated": [
      {
        "user": "646cbcb0f29d303de1b5df7f",
        "value": 4
      },
      {
        "user": "646cbcb0f29d303de1b5df80",
        "value": 2
      }
    ],
    "actual": {
        "user": "646cbcb0f29d303de1b5df81",
        "value": 6
    }
    },
    "cost": {
        "estimated": 384,
        "actual": 416
    },
    "org": "Self",
    "location": "Remote",
    "status": "To Do",
    "skills": [],
    "analytics": {},
    "priority": "",
    "subTasks": [],
    "parentTasks": [],
    "attachments": [],
    "tags": [],
    "date": new Date().toLocaleDateString(),
    "createdAt": "2023-08-11T19:02:19.529Z",
    "updatedAt": "2023-10-21T02:32:14.518Z"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description') {
      setCreateValues((prevState) => ({
        ...prevState,
        short_description: value,
      }));
    }
    if (name === 'title') {
        setCreateValues((prevState) => ({
            ...prevState,
            name: value,
        }));
    }
    setCreateValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if(!e.target.files) {
      dispatch(setAlert('Please select files or group of files!', 'error'));
      return;
    }
    setCreateValues((prevState) => ({
      ...prevState,
      attachments: [...prevState.attachments, ...Array.from(e.target.files).map((file) => {
        const params = {
            Bucket: 'kalkinso.com',
            Key: `users/676fcd15a8c7e1466ecd7e29/temp/attachments/${file.name}`,
          };
        let newTempFiles = {...tempFiles}
        newTempFiles[params.Key] = 'uploading';
        setTempFiles(newTempFiles);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('params', JSON.stringify(params));
        axios.post('/api/kits/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },}).then((response) => {
            if (response.data.success) {
                let newTempFiles = {...tempFiles}
                newTempFiles[params.Key] = 'edit';
                setTempFiles(newTempFiles);
            }
            }).catch((error) => {
                let newTempFiles = {...tempFiles}
                newTempFiles[params.Key] = 'error';
                setTempFiles(newTempFiles);
            });
        return {
          Bucket: params.Bucket,
          Key: params.Key,
        };
      })],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send `formData` to an API or process it as needed
    dispatch(addTask(createValues, '678a0f86256abed9cbcebc43', '678a0f86256abed9cbcebc43', '676fcd15a8c7e1466ecd7e29'));
    setCreateValues({
        "user": {
          "first_name": "Abhishek",
          "last_name": "Shukla",
          "email": "abhishekshukla.shuklaabhishek@gmail.com",
          "mobile": "8953399459",
          "upi": "1b70d1",
          "adhar": "04f7f998-df4",
          "terms_conditions":  "true",
          "avatar": "//www.gravatar.com/avatar/82caf8ce1dd92298fa874e41ac691095?s=200&r=pg&d=mm",
          "date": "2024-12-28T10:04:05.782+00:00"
        },
        "name": "",
        "description": "",
        "short_description": "",
        "assigned": [],
        "time": {
        "estimated": [
          {
            "user": "646cbcb0f29d303de1b5df7f",
            "value": 4
          },
          {
            "user": "646cbcb0f29d303de1b5df80",
            "value": 2
          }
        ],
        "actual": {
            "user": "646cbcb0f29d303de1b5df81",
            "value": 6
        }
        },
        "cost": {
            "estimated": 384,
            "actual": 416
        },
        "org": "Self",
        "location": "Remote",
        "status": "To Do",
        "skills": [],
        "analytics": {},
        "priority": "",
        "subTasks": [],
        "parentTasks": [],
        "attachments": [],
        "tags": [],
        "date": new Date().toLocaleDateString(),
        "createdAt": "2023-08-11T19:02:19.529Z",
        "updatedAt": "2023-10-21T02:32:14.518Z"
      });
    dispatch(setAlert('Reported successfully!', 'success'));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Form onSubmit={handleSubmit}>
        <TextInput
          style={{
              marginBottom: '20px',
          }}
          id="title"
          labelText="Title"
          name="title"
          placeholder="Enter your title"
          value={createValues.title}
          onChange={handleInputChange}
          required
        />
        <TextArea
          id="description"
          labelText="Description"
          name="description"
          placeholder="Describe the issue"
          value={createValues.description}
          onChange={handleInputChange}
          required
        />
        <FileUploaderDropContainer
            style={{
                marginBottom: '20px',
                marginTop: '20px',
            }}
            accept={[]}
            innerRef={{
            current: '[Circular]'
            }}
            labelText="Drag and drop files here or click to upload"
            multiple
            name=""
            onAddFiles={handleFileChange}
        />
        <div className="cds--file-container cds--file-container--drop" />

        {createValues.attachments.map((file, index) => {
            return (
                <FileUploaderItem
                    key={index}
                    name={file.Key.split('/').pop()}
                    status={tempFiles[file.Key]==='error'?'uploading':tempFiles[file.Key]}
                    size="md"
                    invalid={tempFiles[file.Key]==='error'}
                    iconDescription="Delete file"
                    onDelete={() => {
                        setCreateValues((prevState) => ({
                            ...prevState,
                            attachments: prevState.attachments.filter(
                                (f, index) => f.Key !== file.Key
                            ),
                        }));
                    }}
                />
            );
        })}
        <div style={{ marginTop: '20px', float: 'right' }}>
          <Button type="submit" kind="primary">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Reports;
