'use client';

import React, { useState, useCallback, useRef } from 'react';
import FileDropzone from '../components/uploads/FileDropzone';
import WaveformPlayer from '../components/uploads/WaveformPlayer';
import UploadForm from '../components/uploads/UploadForm';
import FileInfoBox from '../components/uploads/FileInfoBox';
import { Head1, Para, Head3 } from '../components/Ui';
import Card from '../components/Card';
import SoundButton from '../components/SoundButton';
import Label from '../components/form/Label';
import { cn } from '../services/cn';
import { WaveformPlayerRef } from '../components/uploads/WaveformPlayer';
import { FileSchema } from '../lib/validators/file.schema';
import { convertWavBlobToMp3 } from '../lib/mp3enocder';
import { fileService } from '../services/fileService';
import { useSession } from 'next-auth/react';
import { useFetchLoading } from '../hooks/useFetchLoading';
import { toast } from 'react-toastify';

interface AudioMetadata {
  title: string;
  tags: string[];
  description: string;
  category: string;
  nsfw: boolean;
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

const colorOptions = [
  {
    id: 'coral-red',
    name: 'Coral Red',
    classes: 'bg-[#FF4144] checked:outline-[#FF4144]',
    value: '0',
  },
  {
    id: 'vermilion-orange',
    name: 'Vermilion Orange',
    classes: 'bg-[#E85100] checked:outline-[#E85100]',
    value: '20',
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    classes: 'bg-[#009C00] checked:outline-[#009C00]',
    value: '125',
  },
  {
    id: 'teal-green',
    name: 'Teal Green',
    classes: 'bg-[#008E3A] checked:outline-[#008E3A]',
    value: '145',
  },
  {
    id: 'aqua-cyan',
    name: 'Aqua Cyan',
    classes: 'bg-[#008CB8] checked:outline-[#008CB8]',
    value: '195',
  },
  {
    id: 'azure-blue',
    name: 'Azure Blue',
    classes: 'bg-[#0A6FD4] checked:outline-[#0A6FD4]',
    value: '225',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    classes: 'bg-[#7862F7] checked:outline-[#7862F7]',
    value: '255',
  },
  {
    id: 'violet',
    name: 'Violet',
    classes: 'bg-[#B74DE8] checked:outline-[#B74DE8]',
    value: '280',
  },
  {
    id: 'magenta',
    name: 'Magenta',
    classes: 'bg-[#D238B3] checked:outline-[#D238B3]',
    value: '305',
  },
  {
    id: 'rose-red',
    name: 'Rose Red',
    classes: 'bg-[#FF3687] checked:outline-[#FF3687]',
    value: '335',
  },
];

const UploadPage: React.FC = () => {
  const [shouldValidate, setShouldValidate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [trimRegion, setTrimRegion] = useState<TrimRegion>({ start: 0, end: 0 });
  const [metadata, setMetadata] = useState<AudioMetadata>({
    title: '',
    tags: [],
    description: '',
    category: 'Random',
    nsfw: false,
  });
  const [trimmedBlob, setTrimmedBlob] = useState<Blob | null>(null);

  const [btnHue, setBtnHue] = useState('0');
  const customAudioRef = useRef<WaveformPlayerRef>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const { data: session } = useSession();
  const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
  const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);


  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);

    if (!file) {
      setFileInfo(null);
      setTrimRegion({ start: 0, end: 0 });
      return;
    }

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
        title: file.name.replace(/\.[^/.]+$/, ''),
      }));
    });
  }, []);

  const handleTrimChange = useCallback((start: number, end: number) => {
    setTrimRegion({ start, end });
  }, []);

  const handleMetadataChange = useCallback((newMetadata: Partial<AudioMetadata>) => {
    setMetadata(prev => ({ ...prev, ...newMetadata }));
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


  const handleSubmit = useCallback(async () => {
    if (!session) return;

    setShouldValidate(true);
    await new Promise(resolve => setTimeout(resolve, 0));

    const payload = {
      title: metadata.title.trim(),
      slug: metadata.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
      duration: formatDuration(trimRegion.end - trimRegion.start),
      tags: metadata.tags,
      category: metadata.category,
      description: metadata.description || "",
      btnColor: btnHue,
      visibility: true,
      user: {
        uid: session.user.uid,
        name: session.user.name,
      }
    };

    const parsed = FileSchema.safeParse(payload);

    if (!parsed.success) {
      toast.error('Please fix form errors.');
      setShouldValidate(false);
      return;
    }

    setShouldValidate(false);

    if (!trimmedBlob) {
      toast.error('Trimmed audio is not ready yet.');
      return;
    }

    openFetchLoading();

    try {
      const trimmedMp3File = await convertWavBlobToMp3(
        trimmedBlob,
        metadata.title || "audio"
      );

      const res = await fileService.postAudio({
        files: trimmedMp3File,
        metadata: parsed.data
      });

      if(res.success) {
        toast.success('Audio uploaded successfully!');
        setSelectedFile(null);
        setFileInfo(null);
        setTrimmedBlob(null);
      } else {
        toast.error(res.message || 'Upload failed');
        throw new Error(res.message || 'Upload failed');
      }

    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Upload failed");
    } finally {
      closeFetchLoading();
    }

  }, [
    session,
    trimmedBlob,
    metadata,
    trimRegion,
    btnHue
  ]);


  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Head1 className='text-center'>Contribute Your Sound Effects</Head1>
          <Para className='mt-2.5 text-center max-w-xl mx-auto'>
            Upload any sound effect – memes, viral clips, or originals – and help grow our community library. Please follow our site guideline when sharing.
          </Para>
        </div>

        <div className="mb-8">
          <FileDropzone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
        </div>

        {selectedFile && fileInfo && (
          <div className="space-y-6">
            <FileInfoBox fileInfo={fileInfo} />

            <Card>
              <Head3 className='mb-4'>Audio Preview</Head3>
              <WaveformPlayer
                ref={customAudioRef}
                file={selectedFile}
                onTrimChange={handleTrimChange}
                trimRegion={trimRegion}
                onPlayingChange={setIsAudioPlaying}
                onTrimmedAudioReady={(blob) => {
                  setTrimmedBlob(blob);
                }}
              />
            </Card>

            <Card>
              <Head3 className='mb-4'>Button Color</Head3>
              <div className='flex gap-16'>
                <div className='size-38 flex justify-center items-center'>
                  <SoundButton
                    onClick={() => {
                      if (!customAudioRef.current) return;
                      customAudioRef?.current.toggleButton();
                    }}
                    className={cn(
                      'scale-150',
                      `hue-rotate-${btnHue}`,
                      { 'btn-animation': isAudioPlaying }
                    )} />
                </div>
                <div className="flex-1">
                  <Label required>Select Button Color</Label>
                  <fieldset>
                    <div className="mt-6 flex items-center gap-x-3">
                      {colorOptions.map((color) => (
                        <div key={color.id} className="flex rounded-full outline -outline-offset-1 outline-black/10">
                          <input
                            defaultValue={color.value}
                            name="btn-color"
                            type="radio"
                            aria-label={color.name}
                            checked={btnHue === color.value}
                            onChange={(e) => setBtnHue(e.target.value)}
                            className={cn(
                              color.classes,
                              'size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3',
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </Card>

            <UploadForm
              metadata={metadata}
              onMetadataChange={handleMetadataChange}
              onSubmit={handleSubmit}
              triggerValidation={shouldValidate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;