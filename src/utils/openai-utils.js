import axios from 'axios';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = new FFmpeg({ log: true });

// Configure your S3 bucket details
AWS.config.update({
  region: 'ap-south-1', // e.g., 'us-east-1'
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const s3 = new S3({
    params: { Bucket: 'kalkinso.com' },
    region: 'ap-south-1',
});
const bucketName = 'kalkinso.com';

/**
 * Generate narration audio using OpenAI's Text-to-Speech API.
 */
export const generateNarrationAudio = async (text, filePath) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key is missing');

  const payload = {
    model: 'tts-1', // Use Whisper or another suitable model for TTS
    input: text,
    voice: 'alloy',
    response_format: 'mp3'
  };

  const response = await axios.post('https://api.openai.com/v1/audio/speech', payload, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    responseType: 'blob' // Ensures the response is a Blob for the audio file
  });

  // Convert blob to a file-like object
  const audioBlob = response.data;
  const audioFile = new File([audioBlob], filePath.replace(/\..+/g,".mp3").split('/').slice(-1)[0], { type: 'audio/mpeg' });

  // Prepare the S3 upload
  const uploadParams = {
    Bucket: bucketName,
    Key: filePath.replace(/\..+/g,".mp3"),
    Body: audioFile,
    ContentType: 'audio/mpeg'
  };

  // Upload the audio to S3
  await s3.upload(uploadParams).promise();

  const signedUrl = await s3.getSignedUrlPromise('getObject', {
    Bucket: bucketName,
    Key: filePath.replace(/\..+/g,".mp3"),
    Expires: 3600 // 1 hour
  });

  return signedUrl;
};

export const convertOpenAIResponseToCustomFormat = (openAIResponseSegment, openAIResponseWord) => {
    const { text, segments } = openAIResponseSegment;
    const { words } = openAIResponseWord;
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
          start: words[entityKeyCounter]?.start, // Adjust this if actual word timings are needed
          end: words[entityKeyCounter]?.end, // Simulate word end time based on length
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

export const convertToMp3 = async (file) => {

  if (!ffmpeg.loaded) {
    // console.log('Loading FFmpeg...');
    await ffmpeg.load();
    // console.log('FFmpeg loaded successfully.');
  }
  
  ffmpeg.writeFile('input.mp4', await file.arrayBuffer());
  await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
  const data = ffmpeg.readFile('output.mp3'); 

  // Convert the resulting Uint8Array to a Blob
  return new Blob([data.buffer], { type: 'audio/mp3' });
};


export const convertSpeechToText = async ({ audioFile, file_path, mp4=false }) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Ensure this is set in your environment variables
  
    // Create a FormData object to hold the audio file
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    } else if (typeof audioFile === 'string') {
      audioFile = await (await fetch(audioFile)).blob();
      if (mp4) {
        audioFile = await convertToMp3(audioFile);
      }
    } // Handle audio file URL
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.mp3'); // Replace 'audio.mp3' with the actual file
    formData.append('model', 'whisper-1'); // Replace with the model name you want to use
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');
    formData.append('timestamp_granularities[]', 'word');
  
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      
      const transcript_editor_format = convertOpenAIResponseToCustomFormat(response.data, response.data);
  
      // Prepare the S3 upload
      const uploadParams = {
        Bucket: 'kalkinso.com', // Replace with your bucket name
        Key: file_path, // The file path in S3, e.g., 'transcriptions/transcription.txt'
        Body: JSON.stringify(transcript_editor_format),
        ContentType: 'text/plain'
      };
  
      // Upload to S3
      await s3.upload(uploadParams).promise();
      
  
      return transcript_editor_format; // The transcribed text from the audio file
  
    } catch (error) {
      console.error('Error during speech-to-text conversion or S3 upload:', error);
      throw error;
    }
  };



export const callOpenAIChatCompletion = async ({ systemPrompt, userPrompt, callFunctions }) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Ensure this is set in your environment variables
    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      tools: callFunctions,
      tool_choice: 'auto'
    };
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  };

/**
 * Generate an image using DALL·E 3 from a text prompt and upload it to S3.
 * @param {string} text - The prompt to generate the image.
 * @param {string} file_path - The S3 file path to upload the image to.
 * @returns {Object} - The response data from the DALL·E API.
 */
export const convertTextToImage = async (text, file_path) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  // Ensure the API key is set
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    return null;
  }

  // Prepare the payload for the DALL·E API
  const payload = {
    prompt: text,
    n: 1, // Number of images to generate
    size: '1024x1024' // Specify the size of the generated image
  };

  try {
    // Call the DALL·E 3 API to generate the image
    const response = await axios.post('https://api.openai.com/v1/images/generations', payload, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the image URL from the response
    const imageUrl = response.data.data[0]?.url;
    if (!imageUrl) {
      console.error('No image URL found in the response');
      return null;
    }

    // Fetch the generated image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Prepare the S3 upload
    const uploadParams = {
      Bucket: 'kalkinso.com', // Replace with your S3 bucket name
      Key: file_path, // The file path in S3, e.g., 'images/image.png'
      Body: imageBuffer,
      ContentType: 'image/png',
    };

    // Upload the image to S3
    await s3.upload(uploadParams).promise();
    

    return { imageUrl, s3Path: file_path };
  } catch (error) {
    console.error('Error during image generation or S3 upload:', error);
    throw error;
  }
};


/**
 * Function to create a code file using OpenAI and upload it to S3.
 * @param {string} prompt - The prompt for generating the code.
 * @param {string} filePath - The S3 file path where the generated code will be saved.
 * @returns {Object} - The generated code and the S3 upload status.
 */
export const createCodeFile = async (prompt, filePath) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  // Ensure the API key is set
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    return null;
  }

  const payload = {
    model: 'gpt-4-0613',
    messages: [
      { role: 'system', content: "You are a coding assistant." },
      { role: 'user', content: `Generate code based on the following prompt: ${prompt}` }
    ],
    max_tokens: 1500, // Adjust as needed to control the length of the generated code
    temperature: 0.3 // Adjust for creativity
  };

  try {
    // Call OpenAI API to generate code
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const generatedCode = response.data.choices[0].message.content;
    

    // Prepare the S3 upload
    const uploadParams = {
      Bucket: 'kalkinso.com', // Replace with your bucket name
      Key: filePath, // The file path in S3, e.g., 'code/generatedCode.js'
      Body: generatedCode,
      ContentType: 'text/plain',
    };

    // Upload the code to S3
    await s3.upload(uploadParams).promise();
    

    return { generatedCode, s3Path: filePath };
  } catch (error) {
    console.error('Error during code generation or S3 upload:', error);
    throw error;
  }
};

/**
 * Generate search queries using OpenAI based on the input text.
 * @param {string} text - The text prompt for generating search queries.
 * @param {Object} options - Optional parameters for Pexels API.
 * @param {string} [options.orientation] - Desired video orientation (landscape, portrait, square).
 * @param {string} [options.size] - Minimum video size (large, medium, small).
 * @param {string} [options.locale] - Locale for the search (e.g., 'en-US', 'ja-JP').
 * @param {number} [options.page] - Page number for the results (default: 1).
 * @param {number} [options.per_page] - Number of results per page (default: 15, max: 80).
 * @returns {Promise<Array<string>>} - An array of search queries.
 */
export const generateSearchQueries = async (text, options = {}) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing');
  }

  const prompt = `Generate 5 diverse and relevant search queries related to the following text for finding stock videos: "${text}"`;

  const payload = {
    model: 'gpt-4-0613',
    messages: [
      { role: 'system', content: "You are an AI assistant that generates search queries." },
      { role: 'user', content: prompt }
    ],
    max_tokens: 100,
    temperature: 0.7,
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  const queries = response.data.choices[0].message.content
    .split('\n')
    .filter((query) => query.trim() !== '');

  return queries.map(query => ({
    query: query.trim(),
    ...options
  }));
};

/**
 * Fetch videos from Pexels based on the search query and options.
 * @param {Object} params - The search parameters for Pexels API.
 * @param {string} params.query - The search query.
 * @param {string} [params.orientation] - Desired video orientation.
 * @param {string} [params.size] - Minimum video size.
 * @param {string} [params.locale] - Locale for the search.
 * @param {number} [params.page] - Page number for the results.
 * @param {number} [params.per_page] - Number of results per page.
 * @returns {Promise<Array<string>>} - An array of video URLs.
 */
export const fetchVideosFromPexels = async (params) => {
  const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

  if (!PEXELS_API_KEY) {
    throw new Error('Pexels API key is missing');
  }

  const { query, orientation='landscape', size='HD', page = 1, per_page = 5 } = params;

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientation}&size=${size}&page=${page}&per_page=${per_page}`;
  

  const response = await (await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })).json();

  // Extract the HD video URLs
  return response.videos.map(video => video.video_files.find(file => file.quality === 'hd')?.link);
};


/**
 * Download a video using Axios and save it locally.
 */
export const downloadVideo = async (url, index) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download video');
  }
  // Save the video to a s3 bucket as temporary storage
  const videoBlob = await response.blob();
  const videoFile = new File([videoBlob], `video_${index}.mp4`, { type: 'video/mp4' });
  const uploadParams = {
    Bucket: 'kalkinso.com',
    Key: `videos-pexel/video_${index}_${url.split('/').slice(-1)[0]}`,
    Body: videoFile,
    ContentType: 'video/mp4'
  };
  await s3.upload(uploadParams).promise();
  // Return signed URL for the video
  return await s3.getSignedUrlPromise('getObject', {
    Bucket: 'kalkinso.com',
    Key: `videos-pexel/video_${index}_${url.split('/').slice(-1)[0]}`,
    Expires: 3600 // 1 hour
  });
};


/**
 * Merge multiple video files into one using ffmpeg.wasm.
 */
export const mergeVideos = async (videoPaths) => {
  const outputVideo = 'final_video.mp4';

  // Ensure FFmpeg is loaded
  if (!ffmpeg.loaded) {
    // console.log('Loading FFmpeg...');
    await ffmpeg.load();
    // console.log('FFmpeg loaded successfully.');
  }

  // Load videos into ffmpeg's virtual file system (FS)
  for (let i = 0; i < videoPaths.length; i++) {
    const fileData = await (await fetch(videoPaths[i])).blob();
    await ffmpeg.writeFile(`input_${i}.mp4`, await fileData.arrayBuffer());
  }

  // Create a text file listing all input videos for concatenation
  const fileList = videoPaths.map((_, i) => `file 'input_${i}.mp4'`).join('\n');
  await ffmpeg.writeFile('input.txt', new TextEncoder().encode(fileList));

  // Merge the videos using FFmpeg
  await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'input.txt', '-c', 'copy', outputVideo]);

  // Read the merged video from FFmpeg's virtual file system
  const data = await ffmpeg.readFile(outputVideo);

  // Convert the output into a File object
  const file = new File([data.buffer], 'merged_video.mp4', { type: 'video/mp4' });

  return file;
};

/**
 * Upload a video to S3.
 */
export const uploadVideoToS3 = async (videoBlob, filePath) => {
  const uploadParams = {
    Bucket: 'kalkinso.com',
    Key: filePath,
    Body: videoBlob,
    ContentType: 'video/mp4'
  };

  await s3.upload(uploadParams).promise();
  const signedUrl = await s3.getSignedUrlPromise('getObject', {
    Bucket: 'kalkinso.com',
    Key: filePath,
    Expires: 3600 // 1 hour
  });
  return signedUrl;
};

/**
 * Merge video and audio using ffmpeg.wasm.
 */
export const mergeVideoWithAudio = async (videoPath, audioPath) => {

  const outputVideo = 'final_video_with_audio.mp4';

  // Load video and audio files into ffmpeg FS
  ffmpeg.writeFile('input.mp4', await (await fetch(videoPath)).arrayBuffer());
  ffmpeg.writeFile('narration.mp3', await (await fetch(audioPath)).arrayBuffer());

  // Merge the video with the narration audio
  await ffmpeg.exec(
    [
    '-i', 'input.mp4',
    '-i', 'narration.mp3',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    outputVideo
    ]
  );

  const data = ffmpeg.readFile(outputVideo);
  return new Blob([data.buffer], { type: 'video/mp4' });
};

/**
 * Main function to generate a video from text.
 */
export const createTextToVideo = async (text, filePath) => {
  try {
    let audioPath = await generateNarrationAudio(text, filePath);

    // Step 1: Generate search queries
    const queries = await generateSearchQueries(text, {
      orientation: 'landscape',
      size: 'large',
      locale: 'en-US',
      per_page: 5
    });

    

    // Step 2: Fetch videos using the generated queries
    let videoUrls = [];
    for (const query of queries) {
      const urls = await fetchVideosFromPexels(query);
      videoUrls = [...videoUrls, ...urls];
      if (videoUrls.length >= 5) break;
    }
    

    // Step 3: Download videos
    const videoPaths = [];
    for (let i = 0; i < videoUrls.length; i++) {
      if(videoUrls[i]){
        const path = await downloadVideo(videoUrls[i], i);
        videoPaths.push(path);
      }
    }

    // Step 4: Merge downloaded videos into one
    const mergedVideoBlob = await mergeVideos(videoPaths);
    
    // Step 5: Upload the final video to S3
    let videoUrl = await uploadVideoToS3(mergedVideoBlob, filePath);

    const mergedVideoWithAudioBlob = await mergeVideoWithAudio(videoUrl, audioPath);

    videoUrl = await uploadVideoToS3(mergedVideoWithAudioBlob, filePath);
    
    return videoUrl;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};