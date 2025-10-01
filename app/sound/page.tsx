"use client"
import React, { useState } from 'react';
import SoundButton from '../components/SoundButton';
import { HomeIcon } from '@heroicons/react/20/solid'
import ShareModal from '../components/ShareModal';
import AddToSoundboardModal, {
  SoundDetails as SoundInfo,
  Soundboard,
} from '../components/AddToSoundboardModal';

import {
  Download,
  Heart,
  Clock,
  Eye,
  Share2,
  Plus,
  ChevronRight,
  Home,
  Flag,
  X
} from 'lucide-react';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Dropdown from '../components/Dropdown';

const reportReason = [
  { id: 1, val: 'Inappropriate Content' },
  { id: 2, val: 'Hate Speech' },
  { id: 3, val: 'Sexual Content' },
  { id: 4, val: 'Violence Promotion' },
  { id: 5, val: 'Harassment & Bullying' },
  { id: 6, val: 'Terrorism Advocacy' },
  { id: 7, val: 'Misinformation' },
  { id: 8, val: 'Spam & Scams' },
  { id: 9, val: 'Copyright Violation' },
  { id: 10, val: 'Privacy Violation' },
  { id: 11, val: 'Other' },
]


function ReportSound() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reportReason[0])

  return (
    <div>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl px-4 py-2.5 text-sm transition-colors">
        <Flag size={16} />
        Report Sound
      </button>

      {/* Modal */}
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
            className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 py-4 px-6 shadow-2xl transition-all data-closed:scale-95 data-closed:opacity-0 sm:py-7 sm:px-7 z-10 after:absolute after:-z-10 after:inset-0.5 after:bg-zinc-900 after:rounded-[inherit]"
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 text-zinc-500 cursor-pointer hover:rotate-90 transition-transform duration-200 hover:text-zinc-400">
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center">
              <DialogTitle
                as="h3"
                className="text-xl font-semibold text-white tracking-tight flex justify-center items-center gap-3"
              >
                <div className="p-2 bg-rose-500/20 rounded-full">
                  <Flag size={20} className="text-rose-400" />
                </div>
                Report Sound
              </DialogTitle>

              <div className="mt-4 ring-1 ring-inset ring-rose-700/30 rounded-xl bg-rose-500/10">
                <dl className='flex flex-col gap-2 items-start px-5 py-3'>
                  <div className='flex gap-3 text-sm w-full overflow-hidden'>
                    <dt className='whitespace-nowrap text-rose-300'>Sound Title :</dt>
                    <dd className='truncate text-rose-100'>Example Sound Title Example Sound Title Title Title Title Title Title Title Title</dd>
                  </div>
                  <div className='flex gap-3 text-sm w-full overflow-hidden'>
                    <dt className='whitespace-nowrap text-rose-300'>Sound Id :</dt>
                    <dd className='truncate text-rose-100'>4zedfe</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Form */}
            <div className="mt-6 space-y-5">

              <div>
                <Dropdown select={reportReason} label='Reason' value={reason} onChange={setReason} />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-white placeholder-zinc-500 shadow-inner focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>



              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue in detail"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-white placeholder-zinc-500 shadow-inner focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
                ></textarea>
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
                onClick={() => {
                  // handle report submission
                  setOpen(false)
                }}
                className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-400 transition"
              >
                Submit Report
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}


// Type definitions
interface Sound {
  id: string;
  title: string;
  uploader: string;
  duration: string;
  plays: string;
  downloads: string;
  likes: number;
  liked: boolean;
  tags: string[];
  description: string;
  category: string;
  audioUrl: string;
}

// Mock data
const mockSound: Sound = {
  id: 'vine-boom-123',
  title: 'Vine Boom Meme Funny Sound Effect Free Download',
  uploader: 'Suraj Kumar',
  duration: '0:05',
  plays: '100k',
  downloads: '45k',
  likes: 500,
  liked: false,
  tags: ['Meme', 'Funny', 'Lol'],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  category: 'Memes',
  audioUrl: '#'
};


// Breadcrumbs Component
const Breadcrumbs: React.FC<{ sound: Sound }> = ({ sound }) => {
  return (
    <nav className="flex items-center gap-1 text-sm mb-6">
      <button className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
        <HomeIcon className='size-4' />
      </button>
      <ChevronRight size={14} className="text-zinc-600" />
      <button className="text-zinc-400 hover:text-blue-400 transition-colors">
        {sound.category}
      </button>
      <ChevronRight size={14} className="text-zinc-600" />
      <span className="text-zinc-300 truncate max-w-xs">
        {sound.title}
      </span>
    </nav>
  );
};

// Sound Player Component
const SoundPlayer: React.FC<{ sound: Sound }> = ({ sound }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const sfx: SoundInfo = {
    id: "sfx_12345",
    title: "Laser Zap",
    description: "Short laser zap SFX",
    thumbnailUrl: "https://via.placeholder.com/150x150.png?text=Laser",
  };
  const boards: Soundboard[] = [
    { id: "board_1", title: "Sci-Fi FX", imageUrl: "https://via.placeholder.com/100x100.png?text=Sci" },
    { id: "board_2", title: "Retro", imageUrl: "https://via.placeholder.com/100x100.png?text=Retro" },
    { id: "board_3", title: "UI Tones" },
    { id: "board_4", title: "Retro", imageUrl: "https://via.placeholder.com/100x100.png?text=Retro" },
  ];

  const handleAddToBoard = (soundId: string, boardId: string) => {
    console.log("Add to board:", soundId, boardId);
    // call API or update local state here
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl shadow-lg p-6 flex flex-col gap-5 justify-between min-h-[390px]">
      <div className='flex justify-center items-center flex-1 mt-5 '>
        <div className="scale-220">
          <SoundButton />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 ">
        <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-zinc-700 ring-1 ring-inset hover:ring-zinc-600">
          <Heart size={18} className='text-zinc-400/90' />
          Like Sound
        </button>
        <button onClick={() => setOpenAdd(true)} className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-zinc-700 ring-1 ring-inset hover:ring-zinc-600">
          <Plus size={18} className='text-zinc-400/90' />
          Soundboard
        </button>
        <AddToSoundboardModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          soundDetails={sfx}
          soundboards={boards}
          onAdd={handleAddToBoard}
        />
        <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-zinc-700 ring-1 ring-inset hover:ring-zinc-600">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-5 text-zinc-400/90' viewBox="0 0 2048 2048"><path fill="currentColor" d="m467 595l90 90l-338 339l338 339l-90 90l-430-429zm1114 0l430 429l-430 429l-90-90l338-339l-338-339zM701 1792l512-1536h134L835 1792z" strokeWidth="51" stroke="currentColor" /></svg>
          </span>
          Embed Button
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-3 rounded-xl transition-colors font-medium">
          <Download size={18} />
          Download Sound
        </button>
      </div>
    </div>
  );
};

// Sound Details Component
const SoundDetails: React.FC<{ sound: Sound }> = ({ sound }) => {
  const [liked, setLiked] = useState<boolean>(sound.liked);
  const [likeCount, setLikeCount] = useState<number>(sound.likes);

  const handleLike = (): void => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const currentUrl = 'http://localhost:3000/sound';
  const [openShare, setOpenShare] = useState(false);

  return (
    <div className="space-y-6 py-1">
      {/* Title and Uploader */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2 leading-tight">
          {sound.title}
        </h1>
        <div className="flex items-center gap-2 text-zinc-400">
          <span>by</span>
          <button className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
            {sound.uploader}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-zinc-300">
          <Clock size={18} className="text-zinc-500" />
          <span>{sound.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Eye size={18} className="text-zinc-500 scale-110" />
          <span>{sound.plays}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Download size={18} className="text-zinc-500" />
          <span>{sound.downloads}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Heart size={18} className="text-zinc-500" />
          <span>{likeCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-2">
          {sound.tags.map((tag, index) => (
            <button
              key={index}
              className="bg-gradient-to-b from-zinc-700 to-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-sm hover:bg-blue-600 hover:text-white relative z-10 after:absolute after:inset-[0.1em] after:bg-zinc-800 after:rounded-[inherit] after:-z-10 hover:brightness-140 transition duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-1.5">Description</h3>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {sound.description}
        </p>
      </div>

      {/* Report Button */}
      <div className="pt-2 flex gap-4">
        <ReportSound />
        <button onClick={() => setOpenShare(true)} className="flex items-center gap-2 bg-zinc-900 ring-1 ring-zinc-700 text-zinc-300 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-zinc-800  hover:ring-zinc-600">
          <Share2 size={16} className='text-zinc-400/90' />
          Share Sound
        </button>
        <ShareModal url={currentUrl} open={openShare} onClose={() => setOpenShare(false)} />
      </div>
    </div>
  );
};

// Main Sound Details Page
const SoundDetailsPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-200">
      <div className="max-w-7xl mx-auto py-8">
        <Breadcrumbs sound={mockSound} />

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-8 mb-12">
          <SoundPlayer sound={mockSound} />
          <SoundDetails sound={mockSound} />
        </div>
      </div>
    </div>
  );
};

export default SoundDetailsPage;