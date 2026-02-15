'use client'
import { useState, useEffect } from 'react';
import Modal, { ModalHeader, ModalBody } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import { Para, CardSpan } from '../Ui';
import Card from '../Card';
import SoundButton from '../SoundButton';
import { getR2Url } from '@/app/lib/r2/r2Url';
import { useLazyAudio } from '@/app/hooks/useAudio';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/solid';
import Button from '../form/Button';
import { toast } from 'react-toastify';
import GoogleAd from '../ad';

interface SoundData {
    s_id?: string;
    title?: string;
    btnColor?: string;
}

function DownloadModal() {
    const { isOpen, type, data, closeModal } = useModal();
    const { s_id = '', title = '', btnColor = '' } = (data as SoundData) || {};

    const audioUrl = s_id ? getR2Url(`store/${s_id}.mp3`) : null;
    const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

    const countDuration = 7;
    const [countdown, setCountdown] = useState(countDuration);
    const [canDownload, setCanDownload] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCountdown(countDuration);
            setCanDownload(false);
            setDownloading(false);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanDownload(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);

    const handleDownload = async () => {
        setDownloading(true);

        try {
            const response = await fetch(`/api/sounds/download/${s_id}`);

            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const data = await response.json();
                toast.error(data.message || 'Failed to download file');
                return;
            }

            if (!response.ok) {
                toast.error('Failed to download file');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${(title || s_id)}-SoundEffectPro.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);


        } catch (error) {
            console.error('Download error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setDownloading(false);
        }
    };


    if (!isOpen || type !== 'download-modal') return null;



    return (
        <Modal open={isOpen} onClose={closeModal} >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                Download Modal
            </ModalHeader>
            <ModalBody>
                <Card className='py-3.5'>
                    <div className="flex items-center gap-5">
                        <div className=" rounded-md overflow-hidden shrink-0">
                            <div className="size-18 flex items-center justify-center">
                                <div className="scale-70 ">
                                    <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="overflow-hidden flex flex-col gap-0.5">
                                    <Para paraHighlight className='capitalize truncate'>{title} | From Sound Effect Pro</Para>
                                    <CardSpan paraHighlight>ID: <span className="text-gray-500 dark:text-zinc-300">{s_id}</span></CardSpan>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div>
                    <div className="flex flex-col items-center gap-4 py-6">
                        {!canDownload ? (
                            <>
                                <button
                                    disabled
                                    className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition w-full bg-gray-200 text-gray-900 dark:bg-zinc-700 dark:text-zinc-400 overflow-hidden h-10"
                                >
                                    <span className="p-0.5 rounded-full bg-white dark:bg-zinc-900/60 flex size-7 items-center justify-center">
                                        {countdown}
                                    </span>

                                    <span
                                        className="absolute inset-0 -z-10 rounded-[inherit] bg-blue-500/15 transition-[width] duration-1000 ease-linear"
                                        style={{ width: `${(countdown / countDuration) * 100}%` }}
                                    />
                                </button>
                            </>
                        ) : (
                            <Button
                                onClick={handleDownload}
                                disabled={downloading}
                                className='w-full'
                                size='md'
                            >
                                {downloading ? (
                                    'Downloading...'
                                ) : (
                                    <>
                                        <ArrowDownOnSquareStackIcon className='size-5' />
                                        Download Now
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                  
                </div>

            </ModalBody>

        </Modal>
    )
}

export default DownloadModal;
