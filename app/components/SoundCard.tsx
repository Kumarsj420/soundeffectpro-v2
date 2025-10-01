"use client";
import { Heart, Download, EllipsisVertical } from "lucide-react";
import React from "react";
import Link
 from "next/link";
export interface SoundCardProps {
  id: number;
  title: string;
  duration: string;
  likes: number;
  downloads: number;
  tag: string;
}
import SoundButton from "./SoundButton";


const SoundCard: React.FC<SoundCardProps> = ({
  title,
  duration,
  likes,
  downloads,
}) => {
  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-md p-4 relative group">
      <div className="flex justify-center mb-4">
        <SoundButton />
      </div>
      <Link href="/sound" className="hover:text-blue-400">
        <h2 className="text-sm font-bold truncate">{title}</h2>
      </Link>
      <div className="mt-1.5 flex justify-between gap-3 overflow-hidden">
        <p className="text-xs text-zinc-400">{duration}s</p>
        <a href="##" className="text-xs text-zinc-400 group/anker truncate">by <span className="text-white group-hover/anker:text-blue-400">Tom Cruise </span></a>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3.5 text-xs text-zinc-300/85">
        <div className="flex gap-3 items-stretch">
          <button className="py-1 px-1.5 ring-1 ring-zinc-600/75 bg-zinc-700/60 hover:bg-zinc-700 hover:ring-zinc-600 rounded-md cursor-pointer transition duration-200">
            <span className="flex items-center gap-1">
              <Heart size={14} /> {likes}
            </span>
          </button>
          <button className="py-1 px-1.5  bg-blue-500 hover:bg-blue-400 rounded-md cursor-pointer transition duration-200">
            <span className="flex items-center gap-1 text-white">
              <Download size={14} /> {downloads}
            </span>
          </button>
        </div>
        <button className="cursor-pointer hover:text-white">
          <EllipsisVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default SoundCard;
