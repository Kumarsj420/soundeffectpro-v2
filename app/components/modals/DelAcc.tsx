'use client'
import React from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Checkbox from '../form/Checkbox';
import Label from '../form/Label';
import Button from '../form/Button';
import { Para } from '../Ui';
import Badge from '../Badge';

import { TrashIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

function DelAcc() {
    const { isOpen, type, data, closeModal } = useModal();

    if (!isOpen || type !== 'del-acc-modal') return null;
    return (
        <Modal open={isOpen} onClose={closeModal} >
            <ModalHeader onClose={closeModal} className='flex items-center gap-2'>
                <Badge variant='error' className='rounded-md size-7' size='auto'>
                    <TrashIcon className='size-4 text-red-100' />
                </Badge>
                <span className='text-error-500 dark:text-error-400'>Delete Data</span>
            </ModalHeader>
            <ModalBody>
                <div className='py-5 relative z-10'>
                    <div className="absolute inset-0 flex justify-center items-center -z-10">
                        <ShieldExclamationIcon className='size-40 text-error-500/40' />
                    </div>
                    <Para className='dark:text-white'>
                        You can delete your account from this section at any time. Please be aware that this action is permanent and cannot be undone. Once your account is deleted, all associated data, including your profile details, preferences, and any stored information, will be removed permanently from our system. After deletion, you will no longer be able to access this account or recover any of its data.
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
                    <Button size='sm' variant='error'>
                        Delete Your Data
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default DelAcc
