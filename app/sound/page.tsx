"use client"
import React, { useState } from 'react';
import SoundButton from '../components/SoundButton';
import { HomeIcon } from '@heroicons/react/20/solid'
import { AddToSoundboardModal, SoundDetails as SoundInfo, Soundboard, ShareModal, ReportSound, EmbedModal, DownloadModal } from '../components/MyModals';

import {
  Download,
  Heart,
  Clock,
  Eye,
  Share2,
  Plus,
  ChevronRight,
  Flag
} from 'lucide-react';


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
      <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
        <HomeIcon className='size-4' />
      </button>
      <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
      <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors">
        {sound.category}
      </button>
      <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
      <span className="text-gray-900 dark:text-zinc-300 truncate max-w-xs">
        {sound.title}
      </span>
    </nav>
  );
};

const boards: Soundboard[] = [
  { id: "board_1", title: "Sci-Fi FX", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6C6i8zewFSehCN-rDAQ-uOlSNTIgk18DQuA&s" },
  { id: "board_2", title: "Retro", imageUrl: "https://st.depositphotos.com/1695227/2328/v/450/depositphotos_23280162-stock-illustration-vintage-car-design-flyer-grungy.jpg" },
  { id: "board_3", title: "UI Tones" },
  { id: "board_4", title: "Fun", imageUrl: "https://img.freepik.com/premium-vector/children-balloons-word-fun_1308-3614.jpg" },
];

// Sound Player Component
const SoundPlayer: React.FC<{ sound: Sound }> = ({ sound }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEmbed, setOpenEmbed] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);

  const sfx: SoundInfo = {
    id: "sfx_12345",
    title: "Laser Zap Laser Zap Laser Zap Laser Zap Laser Zap Laser Zap",
  };


  const handleAddToBoard = (soundId: string, boardId: string) => {
    console.log("Add to board:", soundId, boardId);
    // call API or update local state here
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 flex flex-col gap-5 justify-between min-h-[390px] ring-1 ring-gray-300/80 dark:ring-0 shadow-xl shadow-gray-300/60 dark:shadow-none">
      <div className='flex justify-center items-center flex-1 mt-5 '>
        <div className="scale-220">
          <SoundButton />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 ">
        <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
          <Heart size={18} className='text-gray-500/80 dark:text-zinc-400/90' />
          Like <span className="hidden sm:inline">Sound</span>
        </button>
        <button onClick={() => setOpenAdd(true)} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
          <Plus size={18} className='text-gray-500/80 dark:text-zinc-400/90' />
          Soundboard
        </button>
        <AddToSoundboardModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          soundDetails={sfx}
          soundboards={boards}
          onAdd={handleAddToBoard}
        />
        <button onClick={() => setOpenEmbed(true)} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-5 text-gray-500/80 dark:text-zinc-400/90' viewBox="0 0 2048 2048"><path fill="currentColor" d="m467 595l90 90l-338 339l338 339l-90 90l-430-429zm1114 0l430 429l-430 429l-90-90l338-339l-338-339zM701 1792l512-1536h134L835 1792z" strokeWidth="51" stroke="currentColor" /></svg>
          </span>
          Embed <span className="hidden sm:inline">Button</span>
        </button>
        <EmbedModal
          open={openEmbed}
          onClose={() => setOpenEmbed(false)}
          embedUrl='soundeffectpro.com'
          soundTitle='Demo Title For Embed'
        />
        <button onClick={() => setOpenDownload(true)} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-3 rounded-xl transition-colors font-medium">
          <Download size={18} />
          Download <span className="hidden sm:inline">Sound</span>
        </button>
        <DownloadModal 
        open={openDownload}
        onClose={() => setOpenDownload(false)}
        soundId='sfx_123'
        />
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
  const [isReportOpen, setIsReportOpen] = useState(false)

  return (
    <div className="space-y-6 py-1">
      {/* Title and Uploader */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 leading-tight">
          {sound.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
          <span>by</span>
          <button className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
            {sound.uploader}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
          <Clock size={18} className="text-gray-400 dark:text-zinc-500" />
          <span>{sound.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
          <Eye size={18} className="text-gray-400 dark:text-zinc-500 scale-110" />
          <span>{sound.plays}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
          <Download size={18} className="text-gray-400 dark:text-zinc-500" />
          <span>{sound.downloads}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
          <Heart size={18} className="text-gray-400 dark:text-zinc-500" />
          <span>{likeCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-2">
          {sound.tags.map((tag, index) => (
            <button
              key={index}
              className="bg-gradient-to-b from-gray-200 to-white text-gray-900 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-300 rounded-full px-3 py-1 text-sm hover:bg-blue-600 dark:hover:text-white relative z-10 dark:after:absolute dark:after:inset-[0.1em] dark:after:bg-zinc-800 dark:after:rounded-[inherit] dark:after:-z-10 hover:brightness-105 dark:hover:brightness-140 transition duration-200 shadow-md shadow-gray-300 ring-1 ring-inset ring-gray-300/60 dark:ring-0 dark:shadow-none"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">Description</h3>
        <p className="text-gray-600/90 dark:text-zinc-300 text-sm leading-relaxed">
          {sound.description}
        </p>
      </div>

      {/* Report Button */}
      <div className="pt-2 flex gap-4">
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
        >
          <Flag size={16} />
          Report Sound
        </button>

        <ReportSound
          open={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          soundId="sfx_345"
          title="Testing Title"
        />
        <button onClick={() => setOpenShare(true)} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-white dark:hover:bg-zinc-800  dark:hover:ring-zinc-600">
          <Share2 size={16} className='text-gray-500/80 dark:text-zinc-400/90' />
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
    <div className=" min-h-screen text-zinc-200">
      <div >
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