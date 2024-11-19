import os
import json
import requests
import boto3
from openai import OpenAI
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips, CompositeAudioClip
from pathlib import Path
from botocore.exceptions import ClientError
from pydantic import BaseModel

# Initialize OpenAI client and S3 client
OPENAI_API_KEY = "sk-svcacct-MTwrtYOwmziU69obbn7x6SLE-C0q9jXzTifYPnHDhxQRH1JTdLjprzZrIT1WxbIu0CImCT3BlbkFJAK6L5kP-U_lHvUV6pUsLDhPjxq6Nf3PX21GHEAbK-CyCjIYXouLWpq2JM6ylzdCznCJAA"
PEXELS_API_KEY = "JHaLO1yToRG9Osg0FiKQKJWZE8yi0GSlh2foFPkqtfoOwqoAtbQc9ElY"
BUCKET_NAME = "kalkinso.com"
RAPID_API_KEY = "907f71f2camshab357c69afa7df8p1fd360jsndbc11ed3ad7b"
RAPID_API_URL = "spotify-downloader9.p.rapidapi.com"
SONG_SEARCH_API_URL = "/search"
SONG_DOWNLOAD_API_URL = "/downloadSong"
RAPID_API_HEADERS = {
    "x-rapidapi-key": RAPID_API_KEY,
    "x-rapidapi-host": RAPID_API_URL
}

client = OpenAI(api_key=OPENAI_API_KEY)
s3_client = boto3.client('s3')

# Step 1: Generate a script using GPT-4
class Scene(BaseModel):
    scene_id: str
    scene_narration_in_prompt_language: str
    scene_video_description_english: str

class Video(BaseModel):
    video_id: str
    video_title: str
    video_subtitle: str
    video_description: str
    video_theme_background_music_description: str
    scenes: list[Scene]

def get_scene_descriptions(prompt):
    
    # Define the messages for the chat completion
    messages = [
        {"role": "user", "content": f"""Convert the text into multiple video scenes: {prompt}"""}
    ]
    
    # Create a completion request
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=messages,
        response_format=Video
    )
    
    return completion.choices[0].message.parsed


def search_song(query):
    """Searches for songs based on a query."""
    params = {
        "q": query,
        "type": "multi",
        "limit": "20",
        "offset": "0",
        "noOfTopResults": "1"
    }
    response = requests.get(f"https://{RAPID_API_URL}{SONG_SEARCH_API_URL}", headers=RAPID_API_HEADERS, params=params)
    response.raise_for_status()
    data = response.json()

    # Extract tracks from the response
    if data['success'] and 'tracks' in data['data']:
        tracks = data['data']['tracks']['items']
        if tracks:
            return tracks
    return None


def download_background_music(query):
    """Downloads a song and uploads it to S3."""
    # Download song
    tracks = search_song(query)
    if tracks:
        # Pick the first song
        selected_track = tracks[0]
        track_id = f"https://open.spotify.com/track/{selected_track['id']}"
        song_name = selected_track['name'].replace(" ", "_") + ".mp3"
        querystring = {"songId":track_id}
        response = requests.get(f"https://{RAPID_API_URL}{SONG_DOWNLOAD_API_URL}", headers=RAPID_API_HEADERS, params=querystring)
        json_response = response.json()
        if json_response['success']:
            download_link = json_response['data']['downloadLink']
            response = requests.get(download_link)
        else:
            print("Failed to download the song.")
            return None


        # Save to local file
        with open(f"/tmp/{song_name}", "wb") as file:
            file.write(response.content)
        return f"/tmp/{song_name}"
    else:
        print("No songs found.")
        return None


# Step 2: Convert script to audio using OpenAI TTS model
def text_to_speech(id,script):
    response = client.audio.speech.create(model="tts-1", voice="alloy", input=script)
    audio_path = Path(f"/tmp/script_audio_{id}.mp3")
    response.stream_to_file(audio_path)
    return str(audio_path)

# Step 3: Convert audio to text using Whisper
def audio_to_text(audio_path, language):
    with open(audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            file=audio_file, model="whisper-1", response_format="verbose_json",
            timestamp_granularities=["segment", "word"], language=language
        )
    return [segment.text for segment in transcript.segments]

# Step 4: Fetch videos from Pexels for each scene
def fetch_videos_from_pexels(query):
    url = f"https://api.pexels.com/videos/search?query={query}&orientation=landscape&size=large&per_page=1"
    headers = {"Authorization": PEXELS_API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    videos = response.json().get('videos', [])
    return [video['video_files'][0]['link'] for video in videos if video.get('video_files')[:1]]

# Step 5: Download video from URL
def download_video(url, index):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    video_path = f"/tmp/video_{index}.mp4"
    with open(video_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=1024):
            file.write(chunk)
    return video_path

def process_scene_videos(scene_videos, scene_audio):
    """
    Process each scene: combine videos, sync with the given audio, loop or trim video as needed.
    """
    # Load audio
    audio_clip = AudioFileClip(scene_audio)
    audio_duration = audio_clip.duration

    # Load and concatenate video clips
    clips = [VideoFileClip(path) for path in scene_videos]
    concatenated_video = concatenate_videoclips(clips, method="compose")
    video_duration = concatenated_video.duration

    # Loop the video if audio is longer than video
    if audio_duration > video_duration:
        loop_count = int(audio_duration // video_duration) + 1
        concatenated_video = concatenate_videoclips([concatenated_video] * loop_count, method="compose")

    # Clip the video to match the audio duration
    final_video = concatenated_video.subclip(0, audio_duration)
    final_video = final_video.set_audio(audio_clip)
    
    return final_video


def merge_scenes_with_background_music(scenes, background_music, output_path=None):
    """
    Merge all processed scenes into one video and add background music.
    """
    processed_scenes = []

    # Process each scene
    for scene in scenes:
        scene_videos = scene['video_clip_url']
        scene_audio = scene['audio_path']
        processed_scene = process_scene_videos(scene_videos, scene_audio)
        processed_scenes.append(processed_scene)
    
    # Concatenate all processed scenes into one final video
    final_video = concatenate_videoclips(processed_scenes, method="compose")

    # Load background music
    bg_music_clip = AudioFileClip(background_music)
    bg_music_duration = final_video.duration

    # Trim or loop background music to match the final video duration
    if bg_music_clip.duration > bg_music_duration:
        bg_music_clip = bg_music_clip.subclip(0, bg_music_duration)
    else:
        loop_count = int(bg_music_duration // bg_music_clip.duration) + 1
        bg_music_clip = concatenate_videoclips([bg_music_clip] * loop_count)
        bg_music_clip = bg_music_clip.subclip(0, bg_music_duration)

    # Combine background music with the existing audio of the final video
    final_audio = CompositeAudioClip([final_video.audio, bg_music_clip])
    final_video = final_video.set_audio(final_audio)

    # Define the output path
    output_path = f"/tmp/{output_path}.mp4" if output_path else "/tmp/final_output.mp4"

    # Write the final video file
    final_video.write_videofile(output_path, codec='libx264', audio_codec='aac')
    
    return output_path

def merge_scenes_without_background_music(scenes, output_path=None):
    """
    Merge all processed scenes into one video and add background music.
    """
    processed_scenes = []

    # Process each scene
    for scene in scenes:
        scene_videos = scene['video_clip_url']
        scene_audio = scene['audio_path']
        processed_scene = process_scene_videos(scene_videos, scene_audio)
        processed_scenes.append(processed_scene)
    
    # Concatenate all processed scenes into one final video
    final_video = concatenate_videoclips(processed_scenes, method="compose")

    # Define the output path
    output_path = f"/tmp/{output_path}.mp4" if output_path else "/tmp/final_output.mp4"

    # Write the final video file
    final_video.write_videofile(output_path, codec='libx264', audio_codec='aac')
    
    return output_path


# Step 7: Upload to S3 with signed URL
def upload_to_s3(file_path, s3_key):
    with open(file_path, "rb") as data:
        s3_client.upload_fileobj(data, BUCKET_NAME, s3_key)
    
    # Generate a signed URL
    try:
        signed_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
            ExpiresIn=3600
        )
        return signed_url
    except ClientError as e:
        print(f"Error generating signed URL: {e}")
        return None

# Step 8: Clean up temporary files
def clean_tmp_files(*file_paths):
    for file_path in file_paths:
        if os.path.exists(file_path):
            os.remove(file_path)

# Lambda handler function
def lambda_handler(event, context):
    user_input = event.get('prompt', 'Default prompt for video')

    try:
        # Step 1: Generate script
        script = get_scene_descriptions(user_input).dict()
        
        # Step 2: Convert script to audio
        for i, scene in enumerate(script['scenes']):
            script['scenes'][i]['audio_path'] = text_to_speech(scene['scene_id'], scene['scene_narration_in_prompt_language'])
        
        # Step 4: Fetch videos for scenes
        for i, scene in enumerate(script['scenes']):
            script['scenes'][i]['video_clip_url'] = fetch_videos_from_pexels(scene["scene_video_description_english"])
            script['scenes'][i]['video_clip_url'] = [download_video(scene['video_clip_url'][0], scene['scene_id'])]
        
        
        script['video_background_music_path'] = download_background_music(script['video_theme_background_music_description'])

        # Step 6: Merge videos with audio
        if script['video_background_music_path']:
            script['final_video_path'] = merge_scenes_with_background_music(script['scenes'], script['video_background_music_path'], script['video_id'])
            video_background_music_s3_key = f"output/{script['video_id']}/background_music.mp3"
            script['video_background_music_url'] = upload_to_s3(script['video_background_music_path'], video_background_music_s3_key)
        else:
            script['final_video_path'] = merge_scenes_without_background_music(script['scenes'], script['video_id'])
        
        # Step 7: Upload final video to S3
        s3_key = f"output/{script['video_id']}/{script['video_title']}.mp4"
        video_url = upload_to_s3(script['final_video_path'], s3_key)

        for i, scene in enumerate(script['scenes']):
            video_s3_key = f"output/{script['video_id']}/scenes/scene_{scene['scene_id']}.mp4"
            scene['video_url'] = upload_to_s3(scene['video_clip_url'], video_s3_key)
            audio_path_key = f"output/{script['video_id']}/scenes/scene_{scene['scene_id']}.mp3"
            scene['audio_url'] = upload_to_s3(scene['audio_path'], audio_path_key)

        
        # Step 8: Clean up temporary files
        clean_tmp_files(script['video_background_music_path'], script['final_video_path'], *[scene['final_video_clip_path'] for scene in script['scenes']], *[scene['audio_path'] for scene in script['scenes']])

        script_key = f"output/{script['video_id']}/script.json"
        script_url = upload_to_s3(json.dumps(script), script_key)
        
        # Construct the response
        response = {
            "statusCode": 200,
            "body": json.dumps({
                "video_url": video_url,
                "title": user_input,
                "description": f"A video created based on the script: {user_input}",
                "script_url": script_url,
            })
        }
        return response

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

if __name__ == "__main__":
    event = {"prompt": "Create a short video under 3 minutes featuring a journey through a serene forest. The video should capture the beauty of nature with a gentle sunrise filtering through tall, lush green trees. Include soft morning mist and dew drops on leaves. Birds chirping can be heard faintly in the background. The camera should glide smoothly along a narrow, winding forest path, showcasing colorful wildflowers and occasional glimpses of small forest animals like rabbits or deer. The scene should feel calm, peaceful, and inspiring, with the background music being soft, relaxing, and harmonizing with nature's sounds."}
    print(lambda_handler(event, None))
    # download_background_music("futuristic city")
