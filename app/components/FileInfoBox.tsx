import React from 'react';
import { FileAudio, Clock, HardDrive, FileType } from 'lucide-react';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
}

interface FileInfoBoxProps {
  fileInfo: FileInfo;
}

const FileInfoBox: React.FC<FileInfoBoxProps> = ({ fileInfo }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow p-6 relative z-10 after:absolute after:inset-0.5 after:-z-10 after:bg-zinc-900 after:rounded-[inherit]">
      <h3 className="text-xl font-semibold text-zinc-200 mb-4">File Details</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <FileAudio className="w-5 h-5 text-blue-400" />
          <div className='overflow-hidden'>
            <p className="text-sm text-zinc-400">Filename</p>
            <p className="text-zinc-200 font-medium truncate">{fileInfo.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-zinc-400">Size</p>
            <p className="text-zinc-200 font-medium">{formatFileSize(fileInfo.size)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <FileType className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-zinc-400">Format</p>
            <p className="text-zinc-200 font-medium">{fileInfo.type.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-zinc-400">Duration</p>
            <p className="text-zinc-200 font-medium">{formatDuration(fileInfo.duration)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfoBox;