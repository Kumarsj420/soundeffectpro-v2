import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '../form/Input';
import Label from '../form/Label';
import Button from '../form/Button';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { CardSpan } from '../Ui';

interface WaveformPlayerProps {
  file: File;
  onTrimChange: (start: number, end: number) => void;
  trimRegion: { start: number; end: number };
  onTrimmedAudioReady?: (trimmedBlob: Blob) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export interface WaveformPlayerRef {
  toggleButton: () => void;
}

const WaveformPlayer = forwardRef<WaveformPlayerRef, WaveformPlayerProps>(
  ({ file, onTrimChange, trimRegion, onTrimmedAudioReady, onPlayingChange }, ref) => {

    const waveformRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDragging, setIsDragging] = useState<'start' | 'end' | 'region' | null>(null);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, startTime: 0, endTime: 0 });

    useImperativeHandle(ref, () => ({
      toggleButton: togglePlayback,
    }));

    useEffect(() => {
      onPlayingChange?.(isPlaying);
    }, [isPlaying, onPlayingChange])

    useEffect(() => {
      if (file) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);

        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
          loadAudioBuffer(file);
        });

        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);

          if (trimRegion && audio.currentTime >= trimRegion.end) {
            audio.pause();
            setIsPlaying(false);
          }
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
        });

        audioRef.current = audio;

        return () => {
          if (audio.src) {
            URL.revokeObjectURL(audio.src);
          }
          audio.src = '';
        };
      }
    }, [file, trimRegion?.end, trimRegion]);

    const loadAudioBuffer = async (audioFile: File) => {
      try {
        if (typeof window === 'undefined') return;

        const AudioContextClass =
          window.AudioContext ?? window.webkitAudioContext;

        if (!AudioContextClass) {
          throw new Error('AudioContext is not supported in this browser');
        }

        const audioContext = new AudioContextClass();

        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        audioContextRef.current = audioContext;
        audioBufferRef.current = audioBuffer;
      } catch (error) {
        console.error('Error loading audio buffer:', error);
      }
    };

    const generateTrimmedAudio = useCallback(async (): Promise<Blob | null> => {
      if (!audioBufferRef.current || !audioContextRef.current) {
        console.error('Audio buffer not ready');
        return null;
      }

      try {
        const audioContext = audioContextRef.current;
        const sourceBuffer = audioBufferRef.current;

        const startSample = Math.floor(trimRegion.start * sourceBuffer.sampleRate);
        const endSample = Math.floor(trimRegion.end * sourceBuffer.sampleRate);
        const trimmedLength = endSample - startSample;

        const trimmedBuffer = audioContext.createBuffer(
          sourceBuffer.numberOfChannels,
          trimmedLength,
          sourceBuffer.sampleRate
        );

        for (let channel = 0; channel < sourceBuffer.numberOfChannels; channel++) {
          const sourceData = sourceBuffer.getChannelData(channel);
          const trimmedData = trimmedBuffer.getChannelData(channel);

          for (let i = 0; i < trimmedLength; i++) {
            trimmedData[i] = sourceData[startSample + i];
          }
        }

        const wavBlob = audioBufferToWav(trimmedBuffer);
        return wavBlob;
      } catch (error) {
        console.error('Error generating trimmed audio:', error);
        return null;
      }
    }, [trimRegion]);

    const audioBufferToWav = (buffer: AudioBuffer): Blob => {
      const length = buffer.length;
      const numberOfChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
      const view = new DataView(arrayBuffer);

      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length * numberOfChannels * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numberOfChannels * 2, true);
      view.setUint16(32, numberOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, length * numberOfChannels * 2, true);

      let offset = 44;
      for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          offset += 2;
        }
      }

      return new Blob([arrayBuffer], { type: 'audio/wav' });
    };


    useEffect(() => {
      const updateTrimmedAudio = async () => {
        if (onTrimmedAudioReady && audioBufferRef.current) {
          const trimmedBlob = await generateTrimmedAudio();
          if (trimmedBlob) {
            onTrimmedAudioReady(trimmedBlob);
          }
        }
      };

      const timeoutId = setTimeout(updateTrimmedAudio, 300);
      return () => clearTimeout(timeoutId);
    }, [trimRegion, generateTrimmedAudio, onTrimmedAudioReady]);

    function togglePlayback() {
      if (audioRef.current && trimRegion) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.currentTime = trimRegion.start;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!trimRegion) return;
      const start = Math.max(0, Math.min(parseFloat(e.target.value) || 0, trimRegion.end - 0.1));
      onTrimChange(start, trimRegion.end);
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!trimRegion) return;
      const end = Math.max(trimRegion.start + 0.1, Math.min(parseFloat(e.target.value) || duration, duration));
      onTrimChange(trimRegion.start, end);
    };

    const handleMouseDown = useCallback((handle: 'start' | 'end' | 'region') => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(handle);

      if (handle === 'region') {
        setDragStartPos({
          x: e.clientX,
          startTime: trimRegion.start,
          endTime: trimRegion.end
        });
      }
    }, [trimRegion]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || !waveformRef.current || duration === 0 || !trimRegion) return;

      const rect = waveformRef.current.getBoundingClientRect();

      if (isDragging === 'region') {

        const deltaX = e.clientX - dragStartPos.x;
        const containerWidth = rect.width;
        const deltaTime = (deltaX / containerWidth) * duration;
        const regionDuration = dragStartPos.endTime - dragStartPos.startTime;

        let newStart = dragStartPos.startTime + deltaTime;
        let newEnd = dragStartPos.endTime + deltaTime;

        if (newStart < 0) {
          newStart = 0;
          newEnd = regionDuration;
        }
        if (newEnd > duration) {
          newEnd = duration;
          newStart = duration - regionDuration;
        }

        onTrimChange(newStart, newEnd);
      } else {

        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const time = percentage * duration;

        if (isDragging === 'start') {
          const newStart = Math.max(0, Math.min(time, trimRegion.end - 0.1));
          onTrimChange(newStart, trimRegion.end);
        } else if (isDragging === 'end') {
          const newEnd = Math.max(trimRegion.start + 0.1, Math.min(duration, time));
          onTrimChange(trimRegion.start, newEnd);
        }
      }
    }, [isDragging, duration, trimRegion, onTrimChange, dragStartPos]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(null);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);


    const handleWaveformClick = useCallback((e: React.MouseEvent) => {
      if (isDragging || !waveformRef.current || !audioRef.current) return;

      const rect = waveformRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * duration;

      if (time >= 0 && time <= duration) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    }, [isDragging, duration]);


    const handleSelectAll = () => {
      onTrimChange(0, duration);
    };

    const handleFirst30s = () => {
      onTrimChange(0, Math.min(30, duration));
    };

    const handleLast30s = () => {
      onTrimChange(Math.max(0, duration - 30), duration);
    };

    return (
      <div className="space-y-4">

        <div className="relative">
          <div
            ref={waveformRef}
            className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-lg relative cursor-pointer select-none"
            onClick={handleWaveformClick}
          >

            <div className="flex items-center justify-center h-full pointer-events-none">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-blue-400 mx-px"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    width: '1px',
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>


            <div
              className="absolute top-0 bg-blue-500/10 pointer-events-none"
              style={{
                left: `${trimRegion ? (trimRegion.start / duration) * 100 : 0}%`,
                width: `${trimRegion ? ((trimRegion.end - trimRegion.start) / duration) * 100 : 0}%`,
                height: '100%',
              }}
            />

            {trimRegion && (
              <div
                className="absolute top-0 border-l-2 border-r-2 border-blue-500 cursor-move"
                style={{
                  left: `${(trimRegion.start / duration) * 100}%`,
                  width: `${((trimRegion.end - trimRegion.start) / duration) * 100}%`,
                  height: '100%',
                }}
                onMouseDown={handleMouseDown('region')}
                title="Drag to move selection"
              >

                <div className="absolute inset-0 bg-blue-500/10 hover:bg-blue-500/20 transition-colors" />
              </div>
            )}

            {trimRegion && (
              <div
                className="absolute top-0 w-4 h-full cursor-ew-resize group z-10"
                style={{
                  left: `${(trimRegion.start / duration) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
                onMouseDown={handleMouseDown('start')}
              >
                <div className="w-1 h-full bg-blue-600 dark:bg-blue-700 transition-colors mx-auto" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-blue-400 dark:bg-blue-500 group-hover:bg-blue-400 rounded-sm shadow-lg transition-colors flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>

                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Start: {trimRegion.start.toFixed(1)}s
                </div>
              </div>
            )}


            {trimRegion && (
              <div
                className="absolute top-0 w-4 h-full cursor-ew-resize group z-10"
                style={{
                  left: `${(trimRegion.end / duration) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
                onMouseDown={handleMouseDown('end')}
              >
                <div className="w-1 h-full bg-blue-600 dark:bg-blue-700 transition-colors mx-auto" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-blue-400 dark:bg-blue-500 group-hover:bg-blue-400 rounded-sm shadow-lg transition-colors flex items-center justify-center">
                  <ChevronLeft className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  End: {trimRegion.end.toFixed(1)}s
                </div>
              </div>
            )}


            <div
              className="absolute top-0 w-0.5 h-full bg-white shadow-lg pointer-events-none"
              style={{
                left: `${(currentTime / duration) * 100}%`,
                opacity: currentTime > 0 ? 1 : 0,
              }}
            />
          </div>
        </div>


        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={togglePlayback}
              size='auto'
              className="rounded-full p-2.5"
            >
              {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5 ml-0.5" />}
            </Button>
          </div>


          <CardSpan >
            {trimRegion ? (
              <>
                Selected: {trimRegion.start.toFixed(1)}s - {trimRegion.end.toFixed(1)}s
                <span className="text-blue-400 ml-2">({(trimRegion.end - trimRegion.start).toFixed(1)}s)</span>
              </>
            ) : (
              'No selection'
            )}
          </CardSpan>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label >Start Time (seconds)</Label>
            <Input
              type="number"
              min="0"
              max={duration}
              step="0.1"
              value={trimRegion?.start.toFixed(1) || '0'}
              onChange={handleStartTimeChange}
              className='mt-0.5'
            />
          </div>
          <div>
            <Label>End Time (seconds)</Label>
            <Input
              type="number"
              min={trimRegion?.start ? trimRegion.start + 0.1 : 0}
              max={duration}
              step="0.1"
              value={trimRegion?.end.toFixed(1) || duration.toString()}
              onChange={handleEndTimeChange}
              className="mt-0.5"
            />
          </div>
        </div>


        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={handleSelectAll}
            variant='outline'
          >
            Select All
          </Button>
          <Button
            onClick={handleFirst30s}
            disabled={duration < 30}
            variant='outline'
          >
            First 30s
          </Button>
          <Button
            onClick={handleLast30s}
            disabled={duration < 30}
            variant='outline'
          >
            Last 30s
          </Button>
        </div>


        <CardSpan className='block text-right'>
          Total Duration: {duration.toFixed(1)}s | Current: {currentTime.toFixed(1)}s
          {isDragging && (
            <span className="text-blue-400 ml-2">
              • Adjusting {isDragging === 'region' ? 'region' : `${isDragging} handle`}
            </span>
          )}
        </CardSpan>
      </div>
    );
  })
WaveformPlayer.displayName = 'WaveformPlayer';
export default WaveformPlayer;