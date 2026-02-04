'use client'
import React, { useEffect, useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import { Para, CardSpan } from '../Ui';
import { useSession } from 'next-auth/react';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { toast } from 'react-toastify';
import { fileService } from '@/app/services/fileService';
import Card from '../Card';
import SoundButton from '../SoundButton';
import { getR2Url } from '@/app/lib/r2/r2Url';
import { useLazyAudio } from '@/app/hooks/useAudio';
import Label from '../form/Label';
import Input from '../form/Input';
import Textarea from '../form/Textarea';
import TagInput from '../form/TagInput';
import { colorOptions } from '@/app/(main)/upload/page';
import { cn } from '@/app/services/cn';
import { FileSchema } from '@/app/lib/validators/file.schema';
import { TAG_LIMIT, MIN_TAGS } from '@/app/global';
import { AxiosError } from 'axios';

interface SoundData {
    s_id?: string;
    title?: string;
    btnColor?: string;
    tags?: string[];
    description?: string;
}


function EditSound() {
    const { isOpen, type, data, closeModal } = useModal();
    const { data: session } = useSession();
    const uid = session?.user?.uid;
    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    const { s_id = '', title = '', btnColor = '', tags = [], description = '' } = (data as SoundData) || {};


    const [sfxTitle, setSfxTitle] = useState(title);
    const [sfxTags, setSfxTags] = useState(tags);
    const [sfxDescription, setSfxDescription] = useState(description);
    const [btnHue, setBtnHue] = useState(btnColor);

    const titleSchema = FileSchema.shape.title;
    const tagsSchema = FileSchema.shape.tags;
    const descriptionSchema = FileSchema.shape.description;

    const [titleError, setTitleError] = useState<string | null>(null);
    const [tagsError, setTagsError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);

    const [triggerValidation, setTriggerValidation] = useState(false);

    useEffect(() => {
        if (triggerValidation) {
            console.log('triggering validation');

            const titleResult = titleSchema.safeParse(sfxTitle);
            const tagsResult = tagsSchema.safeParse(sfxTags);
            const descResult = descriptionSchema.safeParse(sfxDescription);

            if (!titleResult.success) {
                setTitleError(titleResult.error.issues[0].message);
            } else {
                setTitleError(null);
            }

            if (!tagsResult.success) {
                setTagsError(tagsResult.error.issues[0].message);
            } else {
                setTagsError(null);
            }

            if (!descResult.success) {
                setDescriptionError(descResult.error.issues[0].message);
            } else {
                setDescriptionError(null)
            }
        }
    }, [triggerValidation]);



    useEffect(() => {
        setSfxTitle(title);
    }, [title]);

    useEffect(() => {
        const result = titleSchema.safeParse(sfxTitle);
        if (!result.success) {
            setTitleError(result.error.issues[0].message);
        } else {
            setTitleError(null);
        }
    }, [sfxTitle])

    useEffect(() => {
        const result = tagsSchema.safeParse(sfxTags);
        if (!result.success) {
            setTagsError(result.error.issues[0].message);
        } else {
            setTagsError(null);
        }

    }, [sfxTags])

    useEffect(() => {
        const result = descriptionSchema.safeParse(sfxDescription);

        if (!result.success) {
            setDescriptionError(result.error.issues[0].message)
        } else {
            setDescriptionError(null)
        }

    }, [sfxDescription])

    useEffect(() => {
        setBtnHue(btnColor);
    }, [btnColor])

    useEffect(() => {
        setSfxTags(prev => {
            if (JSON.stringify(prev) === JSON.stringify(tags)) {
                return prev;
            }
            return tags;
        });
    }, [tags]);


    useEffect(() => {
        setSfxDescription(description);
    }, [description])


    const audioUrl = s_id ? getR2Url(`store/${s_id}.mp3`) : null;
    const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

    const handleSaveEdit = async () => {
        if (!uid) return;
        setTriggerValidation(true);
        const res = titleSchema.safeParse(sfxTitle).success && tagsSchema.safeParse(sfxTags).success && descriptionSchema.safeParse(sfxDescription).success;

        if (!res) {
            toast.error('Update fields correctly');
            setTriggerValidation(false);
            return
        }

        openFetchLoading();

        try {
            const payload = {
                title: sfxTitle,
                tags: sfxTags,
                description: sfxDescription,
                btnColor: btnHue
            }

            const res = await fileService.patchSoundById(s_id, payload);
            if (res.success) {
                toast.success('sound updated successfully')
                closeModal();
            }

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            closeFetchLoading();
        }


    }

    if (!isOpen || type !== 'edit-sound-modal') return null;

    return (
        <Modal open={isOpen} onClose={closeModal} maxWidth='xl' >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                Edit Sound
            </ModalHeader>
            <ModalBody>
                <Card className='py-3.5'>
                    <div className="flex items-center gap-5">
                        <div className=" rounded-md overflow-hidden shrink-0">
                            <div className="size-18 flex items-center justify-center">
                                <div className="scale-70 ">
                                    <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${btnHue} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <div className="overflow-hidden flex flex-col gap-0.5">
                                    <Para paraHighlight className='capitalize truncate'>{sfxTitle} | From Sound Effect Pro</Para>
                                    <CardSpan paraHighlight>ID: <span className="text-gray-500 dark:text-zinc-300">{s_id}</span></CardSpan>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <form className='mt-5 space-y-5'>
                    <div>
                        <Label htmlFor='btn-color' required>Button Color</Label>
                        <div className="flex items-center gap-3 mt-2.5">
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
                                            'size-7 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3',
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor='s-title' required>Title</Label>
                        <Input
                            id='s-title'
                            placeholder='SoundTitle'
                            value={sfxTitle}
                            onChange={(e) => setSfxTitle(e.target.value)}
                            error={titleError ?? undefined}
                            success={!titleError && sfxTitle.length > 2}
                        />
                    </div>
                    <div>
                        <Label htmlFor='s-tags' required>Tags</Label>
                        <TagInput
                            value={sfxTags}
                            onChange={(val) => setSfxTags(val)}
                            maxTags={TAG_LIMIT}
                            error={tagsError ?? undefined}
                            success={!tagsError && sfxTags.length >= MIN_TAGS}
                        />
                    </div>
                    <div>
                        <Label htmlFor='s-des' required>Description</Label>
                        <Textarea
                            id='s-des'
                            placeholder='Describe reason'
                            className=' resize-none'
                            rows={4}
                            value={sfxDescription} onChange={(e) => setSfxDescription(e.target.value)}
                            error={descriptionError ?? undefined}
                            success={!descriptionError}
                        />
                    </div>
                </form>

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
                    <Button size='sm' type='button' onClick={() => handleSaveEdit()}>
                        Save Edit
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default EditSound
