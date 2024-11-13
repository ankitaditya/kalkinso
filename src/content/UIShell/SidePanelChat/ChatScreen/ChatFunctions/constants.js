const FUNCTIONALITIES = {
    "BOT_REPLY":{ "name":"Bot Reply", "description":"Bot replies with a message", "parameters": { "message": { "type": "string", "description": "Message to be sent by the bot" } } },
    "BOT_REPLY_WITH_OPTIONS": { "name":"Bot Reply with Options", "description":"Bot replies with a message and options", "parameters": { "message": { "type": "string", "description": "Message to be sent by the bot" }, "options": { "type": "array", "description": "Options to be displayed", "items": { "type": "string" } } } },
    "CREATE_TEXT_FILE": { "name":"Create Text File", "description":"Create a text file with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for text file generation" } } },
    "FETCH_FILE": { "name":"Fetch File", "description":"Fetch a file with the given name", "parameters": { "file_name": { "type": "string", "description": "Name of the file to fetch" } } },
    "CREATE_IMAGE_FILE": { "name":"Create Image File", "description":"Create an image file with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for image generation" }, "file_name": {"type": "string", "description":"simple and short image file name"} } },
    "CREATE_TTS_AUDIO_FILE": { "name":"Create Audio File", "description":"Create an audio file with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for audio file generation" }, "content": { "type": "string", "description": "content of the file"} } },
    "CREATE_VIDEO_FILE": { "name":"Create Video File", "description":"Create a video file with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for video file generation" }, "file_name": {"type": "string", "description":"simple and short video file name"} } },
    "BUSINESS_IDEA": { "name":"Business Idea Function", "description":"Generates the Business idea", "parameters": { "prompt": { "type": "string", "description": "better and detailed prompt for generating better business ideas" } } },
    "CREATE_CODE_FILE": { "name":"Create Code File", "description":"Create a code file with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for code file generation" } } },
    "CREATE_RESUME": { "name":"Create Resume", "description":"Create a resume with the given content", "parameters": { "prompt": { "type": "string", "description": "prompt for resume generation" } } },
};

export const generateSystemPrompt = () => {
    let prompt = `
  You are an intelligent assistant with the capability to perform a variety of specialized tasks based on user requests. You have access to a set of predefined functions that you can use to fulfill the user's requests accurately. Your primary objective is to understand the user's prompt and utilize the appropriate function to generate the desired output.
  
  Here are the functions you can use:
  `;
  
    // Loop through the functionalities object to generate the list of functions
    Object.keys(FUNCTIONALITIES).forEach((key) => {
      const { name, description, parameters } = FUNCTIONALITIES[key];
      
      // Construct the function details
      prompt += `
  Function: **${name}**
  - Description: ${description}
  - Parameters:
  `;
  
      // Loop through the parameters and add their details
      Object.keys(parameters).forEach((param) => {
        const { type, description } = parameters[param];
        prompt += `  - \`${param}\` (${type}): ${description}\n`;
      });
    });
  
    // Add general instructions for the assistant
    prompt += `
  Instructions:
  - Your primary goal is to understand the user's intent and respond using the appropriate function.
  - If the user’s prompt aligns with one of the available functions, respond by calling that function with the necessary parameters.
  - If a function is required, include all the necessary parameters as specified.
  - If the user's request does not match any function, provide a helpful response using your general knowledge.
  - Always prioritize using the provided functions if they match the user's request.
  
  Examples:
  - User: "Send a message saying 'Hello, how can I help you?'"
    - Response: Use the \`BOT_REPLY\` function with the parameter { "message": "Hello, how can I help you?" }.
  - User: "Create an image of a sunset over the mountains"
    - Response: Use the \`CREATE_IMAGE_FILE\` function with the parameter { "prompt": "sunset over the mountains" }.
  - User: "Generate a text file with the content 'Meeting notes'"
    - Response: Use the \`CREATE_TEXT_FILE\` function with the parameter { "prompt": "Meeting notes" }.
  `;
  
    return prompt;
  };

export const generateCallFunctions = () => {
    return Object.keys(FUNCTIONALITIES).map((key) => {
        const { name, description, parameters } = FUNCTIONALITIES[key];
    
        // Transform the parameters into the OpenAI format
        const formattedParameters = {
          type: "object",
          properties: parameters,
          required: Object.keys(parameters),
          additionalProperties: false,
        };
    
        // Return the tool in the required format
        return {
          type: "function",
          function: {
            name: key,
            description: description,
            parameters: formattedParameters,
          },
        };
      });
  };