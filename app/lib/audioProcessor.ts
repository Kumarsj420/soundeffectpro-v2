import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

let loaded = false;

export async function convertToMp3(file: File) {

  if (!loaded) {
    await ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js",
      wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm",
    });

    loaded = true;
  }

  const inputName = "input";
  const outputName = "output.mp3";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  await ffmpeg.exec([
    "-i", inputName,
    "-map_metadata", "-1",
    "-vn",
    "-acodec", "libmp3lame",
    "-ab", "128k",
    outputName
  ]);

  const mp3Data = await ffmpeg.readFile(outputName);

  return Buffer.from(mp3Data as Uint8Array);
}