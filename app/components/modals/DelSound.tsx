'use client'
import React from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import { Para, CardSpan } from '../Ui';
import Badge from '../Badge';
import { useSession } from 'next-auth/react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { toast } from 'react-toastify';
import { fileService } from '@/app/services/fileService';
import Card from '../Card';
import SoundButton from '../SoundButton';
import { getR2Url } from '@/app/lib/r2/r2Url';
import { useLazyAudio } from '@/app/hooks/useAudio';

interface SoundData {
    s_id?: string;
    title?: string;
    btnColor?: string;
}

function DelSound() {
    const { isOpen, type, data, closeModal } = useModal();
    const { data: session } = useSession();
    const uid = session?.user?.uid;
    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    const { s_id = '', title = '', btnColor = '' } = (data as SoundData) || {};

    const audioUrl = s_id ? getR2Url(`store/${s_id}.mp3`) : null;
    const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

    if (!isOpen || type !== 'del-sound-modal') return null;


    const handleDelSound = async () => {
        if (!uid && s_id) return;
        openFetchLoading();

        try {
            const res = await fileService.deleteById(s_id);

            if (res.success) {
                toast.success('Sound Deleted, refresh this page');
            } else {
                toast.error(res.message || 'Failed to delete sound');
            }

        } catch (error: unknown) {
            console.log('something went wrong while deleting sound', error);

            if (error instanceof Error) {
                toast.error('Something went wrong, try later');
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                toast.error(String(error.message));
            } else {
                toast.error('Server or network error');
            }
        } finally {
            closeFetchLoading();
            closeModal()
        }
    }

    return (
        <Modal open={isOpen} onClose={closeModal} >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                <Badge variant='error' className='rounded-md size-7' size='auto'>
                    <TrashIcon className='size-4 text-red-100' />
                </Badge>
                <span className='text-error-500 dark:text-error-400'>Delete Sound</span>
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
                <div className='py-5 relative z-10'>
                    <Para className='dark:text-white'>
                      <span className='text-warning-500 font-semibold'>Warning:</span>  This action will permanently delete the sound and cannot be reversed. Proceed only if you are certain.
                    </Para>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        onClick={closeModal}
                        variant='outline'
                        size='sm'
                    >
                        Cancel
                    </Button>
                    <Button size='sm' variant='error' type='button' onClick={() => handleDelSound()}>
                        Delete Sound
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default DelSound
