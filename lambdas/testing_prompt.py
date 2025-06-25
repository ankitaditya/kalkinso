import openai
from langdetect import detect
from pydantic import BaseModel
import json

class Scene(BaseModel):
    scene_id: str
    scene_narration_in_prompt_language: str
    scene_video_description_english: str
    scene_background_music_description_english: str

class Video(BaseModel):
    video_title: str
    video_subtitle: str
    video_description: str
    scenes: list[Scene]

# Initialize OpenAI client with your API key
OPENAI_API_KEY = "sk-svcacct-MTwrtYOwmziU69obbn7x6SLE-C0q9jXzTifYPnHDhxQRH1JTdLjprzZrIT1WxbIu0CImCT3BlbkFJAK6L5kP-U_lHvUV6pUsLDhPjxq6Nf3PX21GHEAbK-CyCjIYXouLWpq2JM6ylzdCznCJAA"
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def detect_language(prompt):
    """Detect the language of the provided prompt."""
    try:
        return detect(prompt)
    except Exception as e:
        print(f"Language detection failed: {e}")
        return "en"  # Default to English if detection fails

def scene_description_tool(language):
    """Define a tool for the chat completion API."""
    return {
        "type": "function",
        "function": {
            "name": "generate_scene_description",
            "description": "Generate a scene narration in the detected language and a scene video description in English.",
            "parameters": {
                "type": "object",
                "properties": {
                    "scene_narration": {
                        "type": "string",
                        "description": f"""A detailed scene narration in the {language} language."""
                    },
                    "scene_video_description": {
                        "type": "string",
                        "description": "A brief scene video description in English."
                    }
                },
                "required": ["scene_narration", "scene_video_description"]
            }
        }
    }

def get_scene_descriptions(prompt):
    """Detect language and generate scene descriptions."""
    # Detect language of the prompt
    detected_language = detect_language(prompt)

    tools = [scene_description_tool(detected_language)]
    
    # Define the messages for the chat completion
    messages = [
        {"role": "user", "content": prompt}
    ]
    
    # Create a completion request
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        # tools=tools,
        # tool_choice="auto",
        response_format=Video
    )
    
    return completion.choices[0].message.parsed

# Example prompt
prompt = "Convert the text into multiple video scenes: 描写一个安静的森林场景。"  # A prompt in Chinese for "Describe a quiet forest scene."
result = get_scene_descriptions(prompt)
with open("scene_descriptions.json", "w") as file:
    json.dump(result.dict(), file, indent=2)
