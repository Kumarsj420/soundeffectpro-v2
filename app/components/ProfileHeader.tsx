import React, { useState } from 'react';
import { Plus, Share2, Image as Img, X } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

function CreateSoundboard() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-3.5 py-2.5 text-sm rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
        <Plus size={18} />
        New Soundboard
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        {/* Backdrop */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-closed:opacity-0"
        />

        {/* Modal container */}
        <div className="fixed inset-0 z-10 flex items-center justify-center p-3">
          <DialogPanel
            transition
            className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 py-4 px-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 sm:py-7 sm:px-7 z-10 after:absolute after:-z-10 after:inset-0.5 after:bg-zinc-900 after:rounded-[inherit] "
          >
            <button onClick={() => setOpen(false)} className='absolute right-5 top-5 text-zinc-500 cursor-pointer hover:rotate-90 transition-transform duration-200 hover:text-zinc-400'>
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center">
              <DialogTitle
                as="h3"
                className=" text-xl font-semibold text-white tracking-tight flex justify-center items-center gap-3"
              >
                <div className='p-2 bg-indigo-500/20 rounded-full'>
                  <Plus size={20} className='text-indigo-400' />
                </div>
                New Soundboard
              </DialogTitle>
              <p className="mt-3 text-sm text-zinc-400">
                Create a new soundboard by giving it a title and uploading a thumbnail.
              </p>
            </div>

            {/* Form */}
            <div className="mt-6 space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Title <span className='text-zinc-500'>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter soundboard title"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-white placeholder-zinc-500 shadow-inner  focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Thumbnail Uploader */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Thumbnail <span className='text-zinc-500'>*</span>
                </label>
                <div className="relative flex  w-full cursor-pointer  items-center justify-center rounded-xl border-1 border-dashed border-zinc-600 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-700/40 transition py-3 px-3.5 gap-3">
                  <svg
                    className="size-6 text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-zinc-400 text-center">
                    Add Thumbnail
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <div className='mt-6 max-w-30 aspect-square ring-1 ring-zinc-700 rounded-2xl relative'>
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-1.5 text-xs text-zinc-500 bg-zinc-800/50 rounded-[inherit]">
                    <Img size={28} className='text-zinc-600' strokeWidth={1.4} />
                    <span>Preview</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {/* handle submit */ }}
                className="rounded-xl bg-gradient-to-tr bg-blue-500 hover:bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition"
              >
                Add Soundboard
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>


    </div>
  )
}

interface User {
  name: string;
  email: string;
  image?: string | null;
  joinedAt: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const [isImageError, setIsImageError] = useState(false);

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Mock stats - in real app these would come from props or API
  const stats = {
    uploads: 23,
    likes: 1540,
    following: 89
  };

  // File: pages/test-modal.tsx
  return (
    <div >
      <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0.5 rounded-full bg-zinc-900"></div>

              {/* Avatar */}
              <div className="relative">
                {user.image && !isImageError ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    onError={() => setIsImageError(true)}
                    className="w-24 h-24 rounded-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-xl">
                    <span className="text-white text-3xl font-bold drop-shadow-lg">
                      {getInitial(user.name)}
                    </span>
                  </div>
                )}

                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-3 border-zinc-900 rounded-full z-20 shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                {/* Verified Badge */}
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">{user.email}</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Member since {formatMemberSince(user.joinedAt)}</span>
              </div>
            </div>
          </div>

          <div className="lg:ml-auto w-1/3">
            <div className="grid grid-cols-2 gap-6">
              {/* Uploads */}
              <div className="text-center group cursor-pointer">
                <div className="bg-zinc-800/50 backdrop-blur rounded-xl p-4 group-hover:bg-zinc-800 transition-colors duration-300 border border-zinc-700/50 flex gap-5 justify-center">
                  <div className="flex items-center justify-center mb-2 bg-blue-500/15 size-12 rounded-full p-3">
                    <svg className="size-7 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.uploads}</div>
                    <div className="text-xs text-zinc-400 mt-1">Uploads</div>
                  </div>
                </div>
              </div>

              {/* Likes */}
              <div className="text-center group cursor-pointer">
                <div className="bg-zinc-800/50 backdrop-blur rounded-xl p-4 group-hover:bg-zinc-800 transition-colors duration-300 border border-zinc-700/50 flex gap-5 justify-center">
                  <div className="flex items-center justify-center mb-2 bg-red-500/15 size-12 rounded-full">
                    <svg className="size-7 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.likes.toLocaleString()}</div>
                    <div className="text-xs text-zinc-400 mt-1">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-zinc-800">
          <CreateSoundboard />

          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2.5 text-sm rounded-xl font-medium transition-all duration-300  border border-zinc-700 hover:border-zinc-600">
            <Share2 size={16} />
            Share Profile
          </button>


        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;