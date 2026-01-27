"use client"

import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure'
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import Label from '../form/Label';
import Input from '../form/Input';
import { CardSpan, Para } from '../Ui';
import Toggle from '../form/Toggle';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';
import { validateClientImage } from '@/app/lib/validators/validateClientImage';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { categoryService } from '@/app/services/categoryService';
import { useSession } from 'next-auth/react';

// Extract individual field schemas for validation
const nameSchema = z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be under 100 characters")
    .trim();

const thumbSchema = z
    .string()
    .url("Invalid thumbnail URL")
    .nullable()
    .optional();

function CreateSoundboardModal() {
    const { isOpen, type, closeModal } = useModal();
    const { data: session } = useSession();

    const userUID = session?.user?.uid;
    const userName = session?.user?.name;

    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    // Form state
    const [nameInp, setNameInp] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [thumbPreview, setThumbPreview] = useState<string | null>(null);

    // Error states
    const [nameError, setNameError] = useState<string | null>(null);
    const [thumbError, setThumbError] = useState<string | null>(null);

    // Validation trigger
    const [triggerValidation, setTriggerValidation] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setNameInp('');
            setIsPublic(true);
            setThumbFile(null);
            setThumbPreview(null);
            setNameError(null);
            setThumbError(null);
            setTriggerValidation(false);
        }
    }, [isOpen]);

    // Validate name on change
    useEffect(() => {
        if (nameInp.length === 0 && !triggerValidation) {
            setNameError(null);
            return;
        }

        const result = nameSchema.safeParse(nameInp);
        if (!result.success) {
            setNameError(result.error.issues[0].message);
        } else {
            setNameError(null);
        }
    }, [nameInp, triggerValidation]);

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setThumbFile(null);
            setThumbPreview(null);
            setThumbError(null);
            return;
        }

        try {
            // Validate the image
            await validateClientImage(file);

            // If validation passes, set the file and preview
            setThumbFile(file);
            const previewUrl = URL.createObjectURL(file);
            setThumbPreview(previewUrl);
            setThumbError(null);
        } catch (error) {
            // Clear file input and state on error
            setThumbFile(null);
            setThumbPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setThumbError(error instanceof Error ? error.message : 'Image validation failed');
        }
    };

    // Handle choose thumbnail button click
    const handleChooseThumb = () => {
        fileInputRef.current?.click();
    };

    // Handle remove thumbnail
    const handleRemoveThumb = () => {
        setThumbFile(null);
        if (thumbPreview) {
            URL.revokeObjectURL(thumbPreview);
        }
        setThumbPreview(null);
        setThumbError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (thumbPreview) {
                URL.revokeObjectURL(thumbPreview);
            }
        };
    }, [thumbPreview]);

    // Validate on submit trigger
    useEffect(() => {
        if (triggerValidation) {
            console.log('triggering validation');

            const nameResult = nameSchema.safeParse(nameInp);

            if (!nameResult.success) {
                setNameError(nameResult.error.issues[0].message);
            } else {
                setNameError(null);
            }

            if (!thumbFile) {
                setThumbError('Thumbnail is required');
            } else {
                setThumbError(null);
            }
        }
    }, [triggerValidation, nameInp, thumbFile]);



    const handleSubmit = useCallback(async () => {
        setTriggerValidation(true);

        await new Promise(resolve => setTimeout(resolve, 0));

        const nameResult = nameSchema.safeParse(nameInp);

        if (!nameResult.success || !thumbFile) {
            toast.error('Validation failed, fix errors first');
            setTriggerValidation(true);
            return;
        }

        if (!userUID || !userName) {
            toast.error("User not authenticated");
            return;
        }

        openFetchLoading();

        try {

            const slug = nameInp
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');

            const payload = {
                name: nameInp.trim(),
                slug,
                visibility: isPublic,
                user: {
                    uid: userUID,
                    name: userName,
                },
            };

            const res = await categoryService.createCategory(
                payload,
                thumbFile
            );

            if (res.success) {
                toast.success("Category created successfully");
            } else {
                toast.error("Failed to create category");
            }




        } catch (error) {
            toast.error('Failed to create soundboard');
            console.log('Create soundboard error:', error);
        } finally {
            closeFetchLoading();
            closeModal();
        }

    }, [nameInp, isPublic, thumbFile, openFetchLoading, closeFetchLoading, closeModal]);

    if (!isOpen || type !== 'create-soundboard-modal') return null;

    const isFormValid = !nameError && nameInp.length >= 3 && thumbFile !== null;

    return (
        <Modal open={isOpen} onClose={closeModal} maxWidth='xl'>
            <ModalHeader onClose={closeModal}>
                Create Soundboard
            </ModalHeader>

            <ModalBody className='space-y-4'>
                <div>
                    <Label required>
                        <span>Soundboard Thumb</span>
                        <input
                            type="file"
                            name="board-thumb"
                            id="board-thumb"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/jpg"
                            hidden
                        />
                    </Label>
                    <div className="flex gap-5 items-start mt-1">
                        <div className='w-1/2 aspect-3/2 border-dashed border border-gray-300 dark:border-zinc-600 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-zinc-800 overflow-hidden relative'>
                            {thumbPreview ? (
                                <Image
                                    src={thumbPreview}
                                    alt="Thumbnail preview"
                                    fill
                                    className='object-cover'
                                />
                            ) : (
                                <div>
                                    <PhotoIcon className='size-10 text-gray-400 dark:text-zinc-500/90 mx-auto' />
                                    <Para>No file chosen</Para>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant='outline'
                                    size='sm'
                                    onClick={handleChooseThumb}
                                >
                                    Choose Thumbnail
                                </Button>
                                {thumbFile && (
                                    <Button
                                        type="button"
                                        variant='error'
                                        size='sm'
                                        onClick={handleRemoveThumb}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <CardSpan paraHighlight className='block mt-2'>
                                JPG or PNG. 1MB max.
                            </CardSpan>
                            {thumbError && triggerValidation && (
                                <CardSpan className='block mt-2 text-red-500 dark:text-red-400'>
                                    {thumbError}
                                </CardSpan>
                            )}
                            {thumbFile && !thumbError && (
                                <CardSpan className='block mt-2 text-green-600 dark:text-green-400'>
                                    ✓ {thumbFile.name}
                                </CardSpan>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <Label required htmlFor="board-name">
                        Soundboard Name
                    </Label>
                    <Input
                        type="text"
                        name="board-name"
                        id="board-name"
                        value={nameInp}
                        onChange={(e) => setNameInp(e.target.value)}
                        placeholder="Eg. Meme Hub"
                        className='mt-1'
                        message='Enter a suitable title for soundboard'
                        error={nameError ?? undefined}
                        success={!nameError && nameInp.length >= 3}
                    />
                </div>

                <div className='flex justify-between items-center'>
                    <Label>
                        Public
                    </Label>
                    <Toggle
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.currentTarget.checked)}
                    />
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
                    <Button
                        type="button"
                        size='sm'
                        onClick={handleSubmit}
                        disabled={!isFormValid && triggerValidation}
                    >
                        Create Soundboard
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default CreateSoundboardModal;