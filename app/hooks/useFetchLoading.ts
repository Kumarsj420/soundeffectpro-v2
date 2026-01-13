'use client';
import { create } from 'zustand';

interface fetchLoadingTypes {
    isOpen: boolean,
    openFetchLoading: () => void,
    closeFetchLoading: () => void
}

export const useFetchLoading = create<fetchLoadingTypes>((set) => ({
    isOpen: false,
    openFetchLoading: () => set({ isOpen: true }),
    closeFetchLoading: () => set({ isOpen: false })
}))