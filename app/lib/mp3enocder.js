"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg = null;

export async function convertWavBlobToMp3(
  wavBlob,
  fileName
) {

  if (!ffmpeg) {
    ffmpeg = new FFmpeg();

    await ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
      wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
    });
  }

  const arrayBuffer = await wavBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await ffmpeg.writeFile("input.wav", uint8Array);

  await ffmpeg.exec([
    "-i", "input.wav",
    "-ac", "1",
    "-ab", "128k",
    "output.mp3"
  ]);

  const mp3Data = await ffmpeg.readFile("output.mp3");

  const mp3Blob = new Blob([mp3Data.buffer], {
    type: "audio/mpeg",
  });

  return new File([mp3Blob], `${fileName}.mp3`, {
    type: "audio/mpeg",
  });
}