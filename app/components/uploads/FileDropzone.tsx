import React, { useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { PlayCircleIcon, DocumentIcon } from '@heroicons/react/24/solid';
import { Para, CardSpan } from '../Ui';
import Card from '../Card';
import { validateClientAudio } from '@/app/lib/validators/audioValidator';

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file =>
      file.type.startsWith('audio/') ||
      ['.mp3', '.wav', '.ogg'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (audioFile) {
      onFileSelect(audioFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await validateClientAudio(file);
    onFileSelect(file);

  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <>
      <style jsx>{`
        @keyframes dots-right {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        
        @keyframes dots-left {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 20; }
        }
        
        .border-outer {
          stroke-dasharray: 2 8;
          animation: dots-right 3s linear infinite;
        }
        
        .border-middle {
          stroke-dasharray: 2 8;
          animation: dots-left 2s linear infinite;
        }
        
        .border-inner {
          stroke-dasharray: 2 8;
          animation: dots-right 1.5s linear infinite;
        }
      `}</style>

      <div className="mt-16 relative">
        {/* Show animated borders only when no file is selected */}
        {!selectedFile && (
          <>
            {/* Outermost border - 20% opacity, dots moving right */}
            <svg className="absolute w-full h-full pointer-events-none" style={{ left: '-30px', top: '-30px', width: 'calc(100% + 60px)', height: 'calc(100% + 60px)' }}>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="24"
                fill="none"
                strokeWidth="2"
                opacity="0.3"
                className="border-outer stroke-gray-500 dark:stroke-zinc-500"
              />
            </svg>

            {/* Middle border - 50% opacity, dots moving left */}
            <svg className="absolute w-full h-full pointer-events-none" style={{ left: '-15px', top: '-15px', width: 'calc(100% + 30px)', height: 'calc(100% + 30px)' }}>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="24"
                fill="none"
                strokeWidth="2"
                opacity="0.55"
                className="border-middle stroke-gray-500 dark:stroke-zinc-500"
              />
            </svg>

            <svg className="absolute w-full h-full pointer-events-none" style={{ left: '0px', top: '0px' }}>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="24"
                fill="none"
                strokeWidth="2"
                opacity="1"
                className="border-inner stroke-gray-500 dark:stroke-zinc-500"
              />
            </svg>
          </>
        )}
        {!selectedFile ? (
          <div
            className={`group px-8 py-16 text-center  cursor-pointer relative z-10 rounded-3xl transition duration-200
              ${isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-transparent hover:bg-gray-300/40 dark:hover:bg-zinc-800/40'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <PlayCircleIcon className={`size-22  mx-auto mb-4 text-gray-400 dark:text-zinc-600/90 dark:group-hover:text-zinc-500`} />
            <Para className='mb-1 dark:text-zinc-200'>Click or drag to upload audio</Para>
            <CardSpan>
              Supports MP3, WAV, and OGG files
            </CardSpan>
            <input
              id="file-input"
              type="file"
              accept="audio/mpeg"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <Card className='flex items-center justify-between'>
            <div className="flex items-center space-x-3 flex-1 overflow-hidden ">
              <DocumentIcon className="size-5 text-gray-500 dark:text-zinc-500" />
              <div className='flex-1 overflow-hidden'>
                <Para className='truncate'>{selectedFile.name}</Para>
                <CardSpan>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </CardSpan>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 text-gray-400 dark:text-zinc-400 hover:text-gray-600/90 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </Card>
        )}
      </div>
    </>
  );
};

export default FileDropzone;