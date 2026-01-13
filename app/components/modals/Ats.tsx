'use client'

import React, { useState } from 'react'
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal_Structure'
import { useModal } from '@/app/hooks/useModal';
import SoundButton from '../SoundButton';
import Button from '../form/Button';

function AddToSbModal() {
  const { isOpen, type, data, closeModal } = useModal();

  if (!isOpen || type !== 'ats-modal') return null;

  return (
    <Modal open={isOpen} onClose={closeModal} maxWidth='xl'>
      <ModalHeader onClose={closeModal}>
        Add to Soundboard
      </ModalHeader>

      <ModalBody>
        just for testing, id : {data?.id ?? 'not-recieved id'}
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
          <Button size='sm'>
            Add To Soundboard
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default AddToSbModal;
