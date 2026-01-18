'use client'
import React from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure';
import { useModal } from '@/app/hooks/useModal';
import Button from '../form/Button';
import { Para } from '../Ui';
import Badge from '../Badge';
import { useSession } from 'next-auth/react';
import { uidService } from '@/app/services/uidServices';
import { TrashIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

function DelAcc() {
    const { isOpen, type, data, closeModal } = useModal();
    const { data: session } = useSession();
    const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
    const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

    if (!isOpen || type !== 'del-acc-modal') return null;


    const handleDeleteData = async () => {
        closeModal();
        openFetchLoading();
        try {
            if (session?.user.uid) {
                const res = await uidService.deleteUserByUid(session?.user.uid);
                if (res.success) {
                    toast.success('Account deleted, redirecting in second');
                    setTimeout(() => {
                        signOut();
                    }, 3000)
                } else {
                    toast.error('Something went wrong while deleting data');
                }
            }
        } catch (err) {
            toast.error('Server or network error');
        } finally {
            closeFetchLoading();
        }
    }

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
                    <Button size='sm' variant='error' type='button' onClick={() => handleDeleteData()}>
                        Delete Your Data
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default DelAcc
