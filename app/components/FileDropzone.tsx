import React, { useCallback, useState } from 'react';
import { Upload, File, X, FileMusic } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
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

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    onFileSelect(null as any);
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
            <svg className="absolute w-full h-full pointer-events-none" style={{left: '-30px', top: '-30px', width: 'calc(100% + 60px)', height: 'calc(100% + 60px)'}}>
              <rect 
                x="2" 
                y="2" 
                width="calc(100% - 4px)" 
                height="calc(100% - 4px)" 
                rx="24" 
                fill="none" 
                stroke="rgb(113 113 122)" 
                strokeWidth="2" 
                opacity="0.2"
                className="border-outer"
              />
            </svg>
            
            {/* Middle border - 50% opacity, dots moving left */}
            <svg className="absolute w-full h-full pointer-events-none" style={{left: '-15px', top: '-15px', width: 'calc(100% + 30px)', height: 'calc(100% + 30px)'}}>
              <rect 
                x="2" 
                y="2" 
                width="calc(100% - 4px)" 
                height="calc(100% - 4px)" 
                rx="24" 
                fill="none" 
                stroke="rgb(113 113 122)" 
                strokeWidth="2" 
                opacity="0.5"
                className="border-middle"
              />
            </svg>
            
            {/* Inner border - 100% opacity, dots moving right */}
            <svg className="absolute w-full h-full pointer-events-none" style={{left: '0px', top: '0px'}}>
              <rect 
                x="2" 
                y="2" 
                width="calc(100% - 4px)" 
                height="calc(100% - 4px)" 
                rx="24" 
                fill="none" 
                stroke="rgb(113 113 122)" 
                strokeWidth="2" 
                opacity="1"
                className="border-inner"
              />
            </svg>
          </>
        )}
        {!selectedFile ? (
          <div
            className={`px-8 py-20 text-center  cursor-pointer relative z-10 rounded-3xl transition duration-200
              ${isDragOver 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-transparent hover:bg-zinc-800/40'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <FileMusic strokeWidth={1} className="size-16 text-zinc-500 mx-auto mb-4" />
            <p className="text-lg text-zinc-300 mb-2">Click or drag to upload audio</p>
            <p className="text-sm text-zinc-500">
              Supports MP3, WAV, and OGG files
            </p>
            <input
              id="file-input"
              type="file"
              accept=".mp3,.wav,.ogg,audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg relative z-10 after:absolute after:inset-0.5 after:-z-10 after:bg-zinc-900 after:rounded-[inherit]">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-zinc-200 font-medium">{selectedFile.name}</p>
                <p className="text-sm text-zinc-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FileDropzone;