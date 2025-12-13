import { useRef, useState } from "react";

export function useLazyAudio(url) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const createAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(url);

      audio.addEventListener("loadstart", () => setLoading(true));
      audio.addEventListener("canplay", () => setLoading(false));
      audio.addEventListener("playing", () => {
        setPlaying(true);
        setBuffering(false);
      });
      audio.addEventListener("waiting", () => setBuffering(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audio.addEventListener("ended", () => setPlaying(false));

      audioRef.current = audio;
    }
  };

  const play = () => {
    createAudio();       // create only when needed
    audioRef.current.play();
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { play, pause, loading, buffering, playing };
}
