'use client'
import { AUDIO_FILE_SIZE, AUDIO_FILE_DURATION } from "@/app/global";
import { toast } from "react-toastify";

export async function validateClientAudio(file: File) {

  if (file.type !== "audio/mpeg") {
    toast.error('Only MP3 audio files are allowed');
    throw new Error("Only MP3 audio files are allowed");
  }

  if (!file.name.toLowerCase().endsWith(".mp3")) {
    toast.error('Invalid extension. Only .mp3 allowed');
    throw new Error("Invalid file extension. Only .mp3 allowed");
  }

  if (file.size > AUDIO_FILE_SIZE) {
    toast.error('File size exceeds 2MB limit');
    throw new Error("File size exceeds 2MB limit");
  }

  const audio = document.createElement("audio");
  audio.preload = "metadata";

  return new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);

      if (audio.duration > AUDIO_FILE_DURATION) {
        toast.error('Audio duration exceeds 2 minutes');
        reject(new Error("Audio duration exceeds 2 minutes"));
      } else {
        resolve();
      }
    };

    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl); 
      toast.error('Invalid or corrupted audio file');
      reject(new Error("Invalid or corrupted audio file"));
    };

    audio.src = objectUrl;
  });
}