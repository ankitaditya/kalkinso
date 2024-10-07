import * as actionTypes from '../actions/types';
import { removeObjectById, insertObjectById, renameIdAndReplaceObject, getObjectById } from '../utils/redux-cache';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const initialState = {
        selectedTask: {
            sortBy: ['title'],
            entries: []
        },
    };

// Function to generate a signed URL
async function generateSignedUrl(bucketName, objectKey, expiresIn = 3600) {
    const client = new S3Client({
        region:'ap-south-1',
        credentials: {
            accessKeyId: "AKIA6GBMDGBC6SGUYGUC",
            secretAccessKey: "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",
        }
    });
    try {
      // Create a GetObjectCommand with the bucket and object key
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });
  
      // Generate a signed URL with an expiration time
      const signedUrl = await getSignedUrl(client, command, {
        expiresIn: expiresIn, // URL expiration time in seconds (default: 1 hour)
      });
  
      console.log("Signed URL:", signedUrl);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL", error);
      throw error;
    }
  }
  

export default function kitsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: action.payload,
            }
        case actionTypes.RENAME_FILE:
            let entryObject = getObjectById(state.selectedTask.entries, action.payload.file_id);
            entryObject.title = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.value = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.fileType = action.payload.new_file_id.split('.').slice(-1)[0];
            if(entryObject.signedUrl){
                generateSignedUrl('kalkinso.com', action.payload.new_file_id).then((url)=>{
                    entryObject.signedUrl = url;
                }).catch((err)=>{
                    entryObject.signedUrl = null;
                    console.log(err);
                });
            }
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: renameIdAndReplaceObject(state.selectedTask.entries, action.payload.file_id, action.payload.new_file_id, entryObject),
                }
            }
        case actionTypes.ADD_FILE:
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: insertObjectById(state.selectedTask.entries, action.payload.id, action.payload.value),
                }
            }
        case actionTypes.SET_DELETE_FILE:
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: removeObjectById(state.selectedTask.entries, action.payload),
                }
            }
        default:
            return state
    }
}