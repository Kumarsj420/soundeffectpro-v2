import { AUDIO_FILE_SIZE, AUDIO_FILE_DURATION } from "@/app/global";
import { parseBuffer } from "music-metadata";

export async function validateAudio(file: File) {

  if (file.type !== "audio/mpeg") {
    throw new Error("Only MP3 audio files are allowed");
  }

  if (!file.name.toLowerCase().endsWith(".mp3")) {
    throw new Error("Invalid file extension");
  }

  if (file.size > AUDIO_FILE_SIZE) {
    throw new Error("File size exceeds 2MB limit");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const metadata = await parseBuffer(buffer, {
    mimeType: file.type
  });

  const duration = metadata.format.duration;

  if (!duration) {
    throw new Error("Unable to read audio duration");
  }

  if (duration > AUDIO_FILE_DURATION) {
    throw new Error("Audio duration exceeds 2 minutes");
  }

}
