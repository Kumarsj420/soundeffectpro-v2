'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { X } from 'lucide-react'
import React from 'react'
import { cn } from '@/app/services/cn';
import { Head2 } from '../Ui';

export interface ModalProps {
  open: boolean
  onClose: (value: boolean) => void
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

export interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: (value: boolean) => void
  showCloseButton?: boolean
  className?: string
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = 'lg',
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className={cn(
          'fixed inset-0 bg-gray-400/55 dark:bg-black/60 backdrop-blur-sm',
          'transition-opacity data-closed:opacity-0',
          'data-enter:duration-300 data-leave:duration-200'
        )}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={cn(
              'relative w-full transform overflow-hidden rounded-2xl text-left transition-all',
              'bg-white shadow-xl shadow-gray-400',
              'dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 dark:shadow-zinc-950',
              'dark:after:absolute dark:after:-z-10 dark:after:inset-0.5 dark:after:rounded-[inherit] dark:after:bg-zinc-900',
              'data-closed:translate-y-4 data-closed:opacity-0 data-closed:sm:translate-y-0 data-closed:sm:scale-95',
              'data-enter:duration-300 data-leave:duration-200',
              maxWidthClasses[maxWidth],
              className
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export function ModalHeader({
  children,
  onClose,
  showCloseButton = true,
  className,
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'relative px-5 py-4 border-b',
        'bg-linear-to-b from-p-50 to-p-200 border-p-300/80',
        'dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 dark:border-zinc-700',
        className
      )}
    >
      <Head2 className='flex gap-2 items-center'>
        {children}
      </Head2>

      {showCloseButton && onClose && (
        <button
          onClick={() => onClose(false)}
          aria-label="Close modal"
          className={cn(
            'absolute right-5 top-1/2 -translate-y-1/2 transition-transform duration-200',
            'text-gray-500 hover:text-gray-700 hover:rotate-90',
            'dark:text-zinc-400 dark:hover:text-zinc-300'
          )}
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-5 py-4 max-h-125 overflow-y-auto',
        'bg-white text-gray-900',
        'dark:bg-zinc-900/40 dark:text-zinc-200',
        className
      )}
    >
      {children}
    </div>
  )
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t',
        'bg-gray-50 border-gray-300/70',
        'dark:bg-zinc-900 dark:border-zinc-700',
        className
      )}
    >
      {children}
    </div>
  )
}

