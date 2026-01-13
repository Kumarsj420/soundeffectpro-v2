'use client'
import { create } from 'zustand';

export type ModalType = 'download-modal' | 'share-modal' | 'ats-modal' | 'del-acc-modal' | 'report-modal' | 'embed-modal' | null;

interface ModalState {
    isOpen: boolean;
    type: ModalType;
    data: any;
    openModal: (type: ModalType, data?: any) => void;
    closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
    isOpen: false,
    type: null,
    data: null,

    openModal: (type, data = null) => set({ isOpen: true, type, data }),
    closeModal: () => set({ isOpen: false, type: null, data: null })
}))