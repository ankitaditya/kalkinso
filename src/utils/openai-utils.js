import axios from 'axios';
import AWS from 'aws-sdk';

// Configure your S3 bucket details
AWS.config.update({
  region: 'ap-south-1', // e.g., 'us-east-1'
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const bucketName = 'kalkinso.com';

export const convertOpenAIResponseToCustomFormat = (openAIResponse) => {
    const { text, segments } = openAIResponse;
    const blocks = [];
    const entityMap = {};
    let entityKeyCounter = 0;
  
    // Iterate over each segment to create block and entity data
    segments.forEach((segment, segmentIndex) => {
      const block = {
        key: generateRandomKey(),
        text: segment.text.trim(),
        type: 'paragraph',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {
          speaker: `Speaker_${segmentIndex}`, // Replace or customize as needed
          words: [],
          start: segment.start
        }
      };
  
      // Split the segment's text into words and create word data
      const wordsArray = segment.text.trim().split(/\s+/);
      let offset = 0;
  
      wordsArray.forEach((word, index) => {
        const wordData = {
          start: segment.start + offset, // Adjust this if actual word timings are needed
          end: segment.start + offset + word.length, // Simulate word end time based on length
          confidence: 1, // Placeholder; use actual confidence if available
          word: word,
          punct: word, // Assuming punctuation is already part of the word
          index: index
        };
  
        block.data.words.push(wordData);
  
        // Add to entityRanges for the block
        block.entityRanges.push({
          offset: segment.text.indexOf(word, offset),
          length: word.length,
          key: entityKeyCounter
        });
  
        // Populate entityMap
        entityMap[entityKeyCounter] = {
          type: "WORD",
          mutability: "MUTABLE",
          data: {
            start: wordData.start,
            end: wordData.end,
            confidence: wordData.confidence,
            text: wordData.word,
            offset: block.entityRanges[block.entityRanges.length - 1].offset,
            length: wordData.word.length,
            key: generateRandomKey()
          }
        };
  
        entityKeyCounter++;
        offset += word.length + 1; // Adjust offset for space between words
      });
  
      blocks.push(block);
    });
  
    return {
      blocks,
      entityMap
    };
  }
  
  // Helper function to generate a random key
export const generateRandomKey = () => {
    return Math.random().toString(36).substr(2, 5);
  }

export const createSpeech = async ({model, input, voice, file_path}) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const requestBody = {
    model: model || 'tts-1',
    input: input || "The quick brown fox jumped over the lazy dog.",
    voice: voice || "alloy"
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/audio/speech', requestBody, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'blob' // Ensures the response is a Blob for the audio file
    });

    // Convert blob to a file-like object
    const audioBlob = response.data;
    const audioFile = new File([audioBlob], 'speech.mp3', { type: 'audio/mpeg' });

    // Prepare the S3 upload
    const uploadParams = {
      Bucket: bucketName,
      Key: file_path, // Unique file name in S3
      Body: audioFile,
      ContentType: 'audio/mpeg'
    };

    // Upload to S3
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        return;
      }
      console.log('File successfully uploaded to S3:', data.Location);
    });

    // Optionally, download the file locally
    const audioUrl = window.URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'speech.mp3';
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error('Error generating speech or uploading to S3:', error);
  }
};


export const convertSpeechToText = async ({ audioFile, file_path }) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Ensure this is set in your environment variables
  
    // Create a FormData object to hold the audio file
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1'); // Replace with the model name you want to use
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Transcription result:', response.data.text);
      transcript_editor_format = convertOpenAIResponseToCustomFormat(response.data);
  
      // Prepare the S3 upload
      const uploadParams = {
        Bucket: 'kalkinso.com', // Replace with your bucket name
        Key: file_path, // The file path in S3, e.g., 'transcriptions/transcription.txt'
        Body: JSON.stringify(transcript_editor_format),
        ContentType: 'text/plain'
      };
  
      // Upload to S3
      await s3.upload(uploadParams).promise();
      console.log('File successfully uploaded to S3');
  
      return transcript_editor_format; // The transcribed text from the audio file
  
    } catch (error) {
      console.error('Error during speech-to-text conversion or S3 upload:', error);
      throw error;
    }
  };

