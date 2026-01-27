'use client'

import { useEffect, useState } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure'
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import SoundButton from '../SoundButton';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/app/services/categoryService';
import { getR2Url } from '@/app/lib/r2/r2Url';
import CustomImg from '../CustomImg';
import { useSession } from 'next-auth/react';
import { RadioGroup, Radio, RadioSkeltion } from '../form/RadioGroup';
import { Para, CardSpan } from '../Ui';
import Label from '../form/Label';
import Card from '../Card';
import { useLazyAudio } from '@/app/hooks/useAudio';
import { userService } from '@/app/services/userService';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';

interface SoundData {
  s_id?: string;
  title?: string;
  btnColor?: string;
}

function AddToSbModal() {
  const { isOpen, type, data, closeModal } = useModal();
  const openModal = useModal((s) => s.openModal);
  const { s_id = '', title = '', btnColor = '' } = (data as SoundData) || {};
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const { data: session } = useSession();

  const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
  const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

  const audioUrl = s_id ? getR2Url(`store/${s_id}.mp3`) : null;
  const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

  const {
    data: userBoards,
    isLoading,
  } = useQuery({
    queryKey: ["user-boards", s_id],
    queryFn: ({ pageParam }) =>
      categoryService.getCategory({
        page: 1,
        limit: 20,
        thumb: true,
        userID: session?.user?.uid,
        sortBy: 'createdAt',
        order: 'desc',
      }),

    enabled: !!s_id && isOpen && type === 'ats-modal' && !!session?.user?.uid,
    staleTime: 1000 * 60 * 5,
  });

  const soundboards = userBoards?.data ?? [];

  useEffect(() => {
    if (soundboards.length > 0 && !selectedBoard) {
      setSelectedBoard(soundboards[0].sb_id);
    }
  }, [soundboards, selectedBoard]);


  if (!isOpen || type !== 'ats-modal') return null;
  if (!s_id && !title && !btnColor) return null;

  const handleCreateSoundboard = () => {
    closeModal()
    openModal('create-soundboard-modal');
  }

  const handleAddToSoundboard = async () => {
    if (!selectedBoard) return;

    openFetchLoading();
    try {

      const res = await userService.userATS({
        sb_id: selectedBoard,
        s_id,
      });

      if (res.success) {
        toast.success("Added to soundboard");
        closeModal();
      }

    } catch (error) {

      if (axios.isAxiosError(error)) {

        const message = error.response?.data?.message;

        if (message) {
          toast.error(message);
        } else {
          toast.error("Something went wrong");
        }

      } else {
        toast.error("Unexpected error occurred");
      }

      console.error("Add to soundboard error:", error);
    } finally {
      closeFetchLoading();
    }

  }

  return (
    <Modal open={isOpen} onClose={closeModal} maxWidth='xl'>
      <ModalHeader onClose={closeModal}>
        Add to Soundboard
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

        <div className='mt-4 space-y-2'>
          <Label required >Choose Soundboard</Label>
          <div className="rounded-2xl overflow-hidden ring-1 ring-gray-300 dark:ring-zinc-700 ">
            <div className="grid grid-cols-1 gap-3 px-3 py-4 rounded-2xl h-72 overflow-y-scroll scrollbar-mini dark:bg-zinc-900">
              {
                isLoading ? (
                  <>
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <RadioSkeltion key={idx} />
                    ))}
                  </>
                ) : soundboards.length === 0 ? (
                  <Para className='text-error-500'>No soundboards found, create any soundboard</Para>
                ) : (
                  <>
                    {
                      selectedBoard && (
                        <RadioGroup value={selectedBoard} onChange={(val) => setSelectedBoard(val)} name="soundboard">
                          {soundboards.map((board) => (
                            <Radio key={board.sb_id} value={board.sb_id}>
                              <div className='flex justify-between items-center'>
                                <div className="w-18 h-12 rounded-md overflow-hidden bg-white dark:bg-zinc-800 shrink-0 shadow">
                                  {board.thumb ? (
                                    <CustomImg
                                      width={72}
                                      height={48}
                                      src={getR2Url(`thumb/${board.thumb!}`) ?? ''}
                                      alt={board.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-zinc-500 text-xs">No Img</div>
                                  )}
                                </div>
                                {board.name}
                              </div>
                            </Radio>
                          ))}
                        </RadioGroup>
                      )
                    }

                  </>
                )
              }

            </div>
          </div>
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
          {
            soundboards.length === 0 ? (
              <Button size='sm' onClick={() => handleCreateSoundboard()}>
                Create Soundboard
              </Button>
            ) : (
              <Button size='sm' onClick={() => handleAddToSoundboard()}>
                Add To Soundboard
              </Button>
            )
          }
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default AddToSbModal;
