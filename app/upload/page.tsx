'use client';

import React, { useState, useCallback } from 'react';
import FileDropzone from '../components/FileDropzone';
import WaveformPlayer from '../components/WaveformPlayer';
import UploadForm from '../components/UploadForm';
import FileInfoBox from '../components/FileInfoBox';

interface AudioMetadata {
  title: string;
  tags: string[];
  description: string;
  category: string;
  isSensitive: boolean;
}

interface TrimRegion {
  start: number;
  end: number;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
}

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [trimRegion, setTrimRegion] = useState<TrimRegion>({ start: 0, end: 0 });
  const [metadata, setMetadata] = useState<AudioMetadata>({
    title: '',
    tags: [],
    description: '',
    category: 'Meme',
    isSensitive: false,
  });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    
    // Mock file info - in real app, you'd extract this from the audio file
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        duration: audio.duration,
      });
      setTrimRegion({ start: 0, end: audio.duration });
      setMetadata(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      }));
    });
  }, []);

  const handleTrimChange = useCallback((start: number, end: number) => {
    setTrimRegion({ start, end });
  }, []);

  const handleMetadataChange = useCallback((newMetadata: Partial<AudioMetadata>) => {
    setMetadata(prev => ({ ...prev, ...newMetadata }));
  }, []);

  const handleSubmit = useCallback(() => {
    const uploadData = {
      file: selectedFile,
      fileInfo,
      trimRegion,
      metadata,
    };
    console.log('Upload Data:', uploadData);
    alert('Upload data logged to console!');
  }, [selectedFile, fileInfo, trimRegion, metadata]);

  return (
    <div className="min-h-screen bg-zinc-950 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-200 mb-2 text-center">Contribute Your Sound Effects</h1>
          <p className="text-zinc-400 text-center max-w-2xl m-auto mt-3">
            Upload any sound effect – memes, viral clips, or originals – and help grow our community library. Please follow our site guideline when sharing.
          </p>
        </div>

        {/* Step 1: File Selection */}
        <div className="mb-8">
          <FileDropzone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
        </div>

        {/* Step 2: Audio Preview & Metadata Form */}
        {selectedFile && fileInfo && (
          <div className="space-y-6">
            {/* File Info */}
            <FileInfoBox fileInfo={fileInfo} />

            {/* Audio Waveform */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow p-6 relative z-10 after:absolute after:inset-0.5 after:-z-10 after:bg-zinc-900 after:rounded-[inherit]">
              <h3 className="text-xl font-semibold text-zinc-200 mb-4">Audio Preview</h3>
              <WaveformPlayer
                file={selectedFile}
                onTrimChange={handleTrimChange}
                trimRegion={trimRegion}
              />
            </div>

            {/* Upload Form */}
            <UploadForm
              metadata={metadata}
              onMetadataChange={handleMetadataChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;