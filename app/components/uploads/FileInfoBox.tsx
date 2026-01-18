import React from 'react';
import { Head3, CardSpan, Para } from '../Ui';
import { FolderIcon, ServerIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/solid';
import Card from '../Card';

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
    <Card>
      <Head3 className='mb-3.5'>File Details</Head3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <FolderIcon className="size-5 text-gray-500 dark:text-zinc-500" />
          <div className='overflow-hidden'>
            <CardSpan>Filename</CardSpan>
            <Para>{fileInfo.name}</Para>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <ServerIcon className="size-5 text-gray-500 dark:text-zinc-500" />
          <div>
            <CardSpan>Size</CardSpan>
            <Para>{formatFileSize(fileInfo.size)}</Para>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="size-5 text-gray-500 dark:text-zinc-500" />
          <div>
            <CardSpan>Format</CardSpan>
            <Para>{fileInfo.type.split('/')[1]?.toUpperCase() || 'Unknown'}</Para>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <ClockIcon className="size-5 text-gray-500 dark:text-zinc-500" />
          <div>
            <CardSpan>Duration</CardSpan>
            <Para>{formatDuration(fileInfo.duration)}</Para>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileInfoBox;