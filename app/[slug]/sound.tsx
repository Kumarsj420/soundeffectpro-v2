"use client"
import React, { useEffect, useState } from 'react';
import SoundButton from '../components/SoundButton';
import { fileService } from '../services/fileService';
import { IFile } from '../models/File';
import { HomeIcon } from '@heroicons/react/20/solid';
import Loading from '@/app/loading';
import { useLazyAudio } from '../hooks/useAudio';


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


interface SoundDetailsPageProps {
  slug: string;
}

const SoundDetailsPage = ({ slug }: SoundDetailsPageProps) => {
  const id = slug.split("-").pop();

  const [sfxInfo, setSfxInfo] = useState<IFile | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const { play, pause, loading, playing, buffering } =
    useLazyAudio(`/store/${id}.mp3`);

  const fetchSound = async () => {
    if (!id) return;
    try {
      const resData = await fileService.getFilesById(id);
      setSfxInfo(resData.data)
    } catch (error) {
      console.log('something went wrong while fetching sound data', error);
    } finally {
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    fetchSound()
  }, [])


  if (loadingPage) {
    return (
      <Loading />
    )
  }

  return (
    <div className=" min-h-screen text-zinc-200">
      <div >
        {/* breadcrumps */}
        <nav className="flex items-center gap-1 text-sm mb-6">
          <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
            <HomeIcon className='size-4' />
          </button>
          <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
          <button className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors">
            {sfxInfo?.category ? sfxInfo?.category : 'Random'}
          </button>
          <ChevronRight size={14} className="text-gray-600 dark:text-zinc-600" />
          <span className="text-gray-900 dark:text-zinc-300 truncate max-w-xs">
            {sfxInfo?.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-8 mb-12">
          {/* sound player */}
          <div className="bg-gradient-to-br from-white to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 flex flex-col gap-5 justify-between min-h-[390px] ring-1 ring-gray-300/80 dark:ring-0 shadow-xl shadow-gray-300/60 dark:shadow-none">
            <div className='flex justify-center items-center flex-1 mt-5 '>
              <div className="scale-220">
                <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${sfxInfo?.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
                <Heart size={18} className='text-gray-500/80 dark:text-zinc-400/90' />
                Like <span className="hidden sm:inline">Sound</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
                <Plus size={18} className='text-gray-500/80 dark:text-zinc-400/90' />
                Soundboard
              </button>

              <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600/90 dark:text-zinc-300 px-4 py-3 rounded-xl transition-colors ring-gray-300 dark:ring-zinc-700 ring-1 ring-inset hover:ring-gray-300 dark:hover:ring-zinc-600">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className='size-5 text-gray-500/80 dark:text-zinc-400/90' viewBox="0 0 2048 2048"><path fill="currentColor" d="m467 595l90 90l-338 339l338 339l-90 90l-430-429zm1114 0l430 429l-430 429l-90-90l338-339l-338-339zM701 1792l512-1536h134L835 1792z" strokeWidth="51" stroke="currentColor" /></svg>
                </span>
                Embed <span className="hidden sm:inline">Button</span>
              </button>

              <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-3 rounded-xl transition-colors font-medium">
                <Download size={18} />
                Download <span className="hidden sm:inline">Sound</span>
              </button>

            </div>
          </div>

          {/* sound details */}
          <div className="space-y-6 py-1">
            {/* Title and Uploader */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 leading-tight capitalize">
                {sfxInfo?.title} | Sound Effect Pro
              </h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                <span>by</span>
                <button className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
                  {sfxInfo?.user.name}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Clock size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Eye size={18} className="text-gray-400 dark:text-zinc-500 scale-110" />
                <span>{sfxInfo?.stats.views}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Download size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.stats.downloads}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-300">
                <Heart size={18} className="text-gray-400 dark:text-zinc-500" />
                <span>{sfxInfo?.stats.likes}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex flex-wrap gap-2">
                {
                  sfxInfo?.tags.map((tag, index) => (
                    <button key={index}
                      className="bg-gradient-to-b from-gray-200 to-white text-gray-900 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-300 rounded-full px-3 py-1 text-sm hover:bg-blue-600 dark:hover:text-white relative z-10 dark:after:absolute dark:after:inset-[0.1em] dark:after:bg-zinc-800 dark:after:rounded-[inherit] dark:after:-z-10 hover:brightness-105 dark:hover:brightness-140 transition duration-200 shadow-md shadow-gray-300 ring-1 ring-inset ring-gray-300/60 dark:ring-0 dark:shadow-none"
                    >
                      {tag}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">Description</h3>
              <p className="text-gray-600/90 dark:text-zinc-300 text-sm leading-relaxed">
                {sfxInfo?.description}
                {!sfxInfo?.description && ('There is no description available for this sound..')}
              </p>
            </div>

            {/* Report Button */}
            <div className="pt-2 flex gap-4">
              <button
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl px-4 py-2.5 text-sm transition-colors"
              >
                <Flag size={16} />
                Report Sound
              </button>


              <button className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 ring-1 ring-gray-300 dark:ring-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-white dark:hover:bg-zinc-800  dark:hover:ring-zinc-600">
                <Share2 size={16} className='text-gray-500/80 dark:text-zinc-400/90' />
                Share Sound
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>



  );
};

export default SoundDetailsPage;