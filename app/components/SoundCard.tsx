"use client";
import { Heart, Download, EllipsisVertical, Plus, Share2, Flag } from "lucide-react";
import React from "react";
import Link from "next/link";
import SoundButton from "./SoundButton";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react';
import {useLazyAudio} from './../hooks/useAudio';
import {useNumberAbbreviation} from './../hooks/useNumberAbbreviation'

export interface SoundCardProps {
  obj: any
}

const SoundCard: React.FC<SoundCardProps> = ({
  obj
}) => {

   const { play, pause, loading, playing, buffering } =
    useLazyAudio(`/store/${obj.s_id}.mp3`);

    const abbriviatedNum = useNumberAbbreviation();

  return (
    <div className="bg-gradient-to-br from-white  to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl shadow-lg shadow-gray-300/60 dark:shadow-none p-4 relative group ring-1 ring-gray-300/80 dark:ring-0">
      <div className="flex justify-center mb-4">
        <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${obj.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
      </div>
      <Link href={`/${obj.slug}-${obj.s_id}`} className=" hover:text-blue-400 text-gray-900 dark:text-white">
        <h2 className="text-sm font-bold truncate capitalize">{obj.title}</h2>
      </Link>
      <div className="mt-1.5 flex justify-between gap-3 overflow-hidden">
        <p className="text-xs text-gray-600/90 dark:text-zinc-400">{obj.duration}</p>
        <a href="##" className="text-xs text-gray-600/90 dark:text-zinc-400 group/anker truncate">by <span className="text-gray-900 dark:text-white group-hover/anker:text-blue-400">{obj.user.name} </span></a>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3.5 text-xs text-gray-500 dark:text-zinc-300/85">
        <div className="flex gap-3 items-stretch">
          <button className="py-1 px-1.5 ring-1 ring-gray-300/80 dark:ring-zinc-600/75 bg-gray-50 dark:bg-zinc-700/60 hover:bg-white hover:ring-gray-300 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600 rounded-md cursor-pointer transition duration-200">
            <span className="flex items-center gap-1">
              <Heart size={14} /> {abbriviatedNum(obj.stats.likes)}
            </span>
          </button>
          <button className="py-1 px-1.5  bg-blue-500 hover:bg-blue-400 rounded-md cursor-pointer transition duration-200">
            <span className="flex items-center gap-1 text-white">
              <Download size={14} /> {abbriviatedNum(obj.stats.downloads)}
            </span>
          </button>
        </div>
        <Menu as="div" className="relative inline-block">
          <MenuButton className='cursor-pointer hover:text-gray-700 dark:hover:text-white'>
            <EllipsisVertical size={16} />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200/80 rounded-2xl bg-white shadow-lg shadow-gray-200 outline-1 outline-gray-300/70 transition  data-closed:transform data-closed:opacity-0 data-closed:scale-50 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:divide-white/10 dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 overflow-hidden "
          >
            <div className="py-1">
              <MenuItem>
                <button
                  className="group flex items-center px-4 py-2 text-sm text-gray-600/90 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full"
                >
                  <Plus
                    aria-hidden="true"
                    strokeWidth={2.3}
                    className="mr-3 size-5 scale-105 text-gray-400 group-data-focus:text-gray-500 dark:text-zinc-500 dark:group-data-focus:text-white"
                  />
                  Add To Soundboard
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="group flex items-center px-4 py-2 text-sm text-gray-600/90 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full"
                >
                  <Icon
                    icon='icomoon-free:embed2'
                    aria-hidden="true"
                    className="mr-3 size-5  text-gray-400 group-data-focus:text-gray-500 dark:text-zinc-500 dark:group-data-focus:text-white"
                  />
                  Embed Button
                </button>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <button
                  className="group flex items-center px-4 py-2 text-sm text-blue-500 data-focus:bg-gray-100 data-focus:text-blue-600 data-focus:outline-hidden dark:text-blue-400 dark:data-focus:bg-white/5 dark:data-focus:text-blue-300 w-full"
                >
                  <div className="p-1 ring-1 ring-blue-500/70 bg-blue-300/15 dark:bg-blue-500/15 size-6 rounded-md mr-3 ">
                    <Share2
                      strokeWidth={2.3}
                      aria-hidden="true"
                      className="scale-85 size-4 text-blue-500 dark:text-blue-400 group-data-focus:text-blue-600 dark:group-data-focus:text-blue-300 "
                    />
                  </div>
                  Share
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className="group flex items-center px-4 py-2 text-sm text-rose-500 data-focus:bg-gray-100 data-focus:text-rose-600 data-focus:outline-hidden dark:text-rose-400 dark:data-focus:bg-white/5 dark:data-focus:text-rose-300 w-full"
                >
                  <div className="p-1 ring-1 ring-rose-500/70 bg-rose-300/15 dark:bg-rose-500/15 size-6 rounded-md mr-3 ">
                    <Flag
                      strokeWidth={2.3}
                      aria-hidden="true"
                      className="scale-85 size-4 text-rose-500 dark:text-rose-400 group-data-focus:text-rose-600 dark:group-data-focus:text-rose-300 "
                    />
                  </div>
                  Report
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default SoundCard;
