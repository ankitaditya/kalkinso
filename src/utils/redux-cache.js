import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Function to generate a signed URL
export async function generateSignedUrl(bucketName, objectKey, expiresIn = 3600) {
    const client = new S3Client({
        region:'ap-south-1',
        credentials: {
            accessKeyId: "AKIA6GBMDGBCUSP2OAAD",
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
  
      // console.log("Signed URL:", signedUrl);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL", error);
      throw error;
    }
  }

export const cache = (action, dispatch) => {
    
    if (action.type === 'CLEAR_CACHE') {
        if (action.payload){
            // clear cache for specific action
            let data = window.localStorage.getItem('__data');
            delete data[action.payload];
            window.localStorage.setItem('__data', data);
            return true;
        }
        // clear cache
        window.localStorage.removeItem('__data');
        return true;
    }

    // check if cache is available
    const data = window.localStorage.getItem('__data');
    if (data){
        const cache = JSON.parse(data);
        if (cache[action.type]){
            dispatch(cache[action.type]);
            return true;
        }
    }
    return false;
  }

export  function removeObjectById(data, targetId) {
    // Recursive helper function to traverse and remove the object
    function removeObject(entries, targetId) {
      return entries.filter(entry => {
        if (entry.id === targetId) {
          return false; // Remove this object
        }
        if (entry.children && entry.children.entries) {
          // Recursively traverse children and update the children entries
          entry.children.entries = removeObject(entry.children.entries, targetId);
        }
        return true; // Keep the object
      });
    }
  
    // Start traversal from the root children.entries
    if (data.children && data.children.entries) {
      data.children.entries = removeObject(data.children.entries, targetId);
    }
  
    return data;
  }

 export function insertObjectById(data, parentId, newObject) {
    // Recursive helper function to traverse and insert the object
    function insertObject(entries, parentId, newObject) {
      return entries.map(entry => {
        if (entry.id === parentId) {
          if (!entry.children) {
            entry.children = { entries: [] }; // Create children if they don't exist
          }
          // Insert the new object into the children entries
          entry.children.entries.push(newObject);
        } else if (entry.children && entry.children.entries) {
          // Recursively traverse children and insert the object
          entry.children.entries = insertObject(entry.children.entries, parentId, newObject);
        }
        return entry;
      });
    }
  
    // Start traversal from the root children.entries
    if (data.children && data.children.entries) {
      data.children.entries = insertObject(data.children.entries, parentId, newObject);
    }
  
    return data;
  }

export function getObjectById(data, targetId) {
    // Recursive helper function to traverse and find the object
    function findObject(entries, targetId) {
      for (let entry of entries) {
        if (entry.id === targetId) {
          return entry; // Return the found object
        }
        if (entry.children && entry.children.entries) {
          const found = findObject(entry.children.entries, targetId);
          if (found) {
            return found; // Return the found object if exists
          }
        }
      }
      return null; // Return null if not found
    }
  
    // Start traversal from the root children.entries
    if (data.children && data.children.entries) {
      return findObject(data.children.entries, targetId);
    }
  
    return null; // Return null if root does not have children
  }

 export function replaceObjectById(data, targetId, newObject) {
    // Recursive helper function to traverse and replace the object
    function replaceObject(entries, targetId, newObject) {
      return entries.map(entry => {
        if (entry.id === targetId) {
          return newObject; // Replace the object
        }
        if (entry.children && entry.children.entries) {
          // Recursively traverse children and replace the object if needed
          entry.children.entries = replaceObject(entry.children.entries, targetId, newObject);
        }
        return entry; // Return unchanged entry
      });
    }
  
    // Start traversal from the root children.entries
    if (data.children && data.children.entries) {
      data.children.entries = replaceObject(data.children.entries, targetId, newObject);
    }
  
    return data;
  }

export function renameIdAndReplaceObject(data, targetId, newId, newObject) {
    // Recursive helper function to traverse and replace the object with renamed id
    function replaceAndRenameObject(entries, targetId, newId, newObject) {
      return entries.map(entry => {
        if (entry.id === targetId) {
          // Rename the id of the new object
          newObject.id = newId;
          return newObject; // Replace the object with the updated id and new object
        }
        if (entry.children && entry.children.entries) {
          // Recursively traverse children and replace/rename the object if needed
          entry.children.entries = replaceAndRenameObject(entry.children.entries, targetId, newId, newObject);
        }
        return entry; // Return unchanged entry
      });
    }
  
    // Start traversal from the root children.entries
    if (data.children && data.children.entries) {
      data.children.entries = replaceAndRenameObject(data.children.entries, targetId, newId, newObject);
    }
  
    return data;
  }

export function handleSaveShortcuts(event){
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
      // Call your custom function here
      // console.log("ctrl + s pressed")
  }
}