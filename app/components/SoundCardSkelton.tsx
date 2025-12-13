"use client";
import { Heart, Download, EllipsisVertical, Plus, Share2, Flag } from "lucide-react";
import React from "react";
import SoundButton from "./SoundButton";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react';



const SoundCardSkelton = () => {
  return (
    <div className="bg-gradient-to-br from-white  to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl shadow-lg shadow-gray-300/60 dark:shadow-none p-4 relative group ring-1 ring-gray-300/80 dark:ring-0 ">
      <div className="flex justify-center mb-4">
        <div className="size-21 bg-zinc-700 rounded-full animate-pulse"></div>
      </div>
      <div className="bg-zinc-700 h-5 w-full rounded-lg animate-pulse">
      </div>
      <div className="mt-1.5 bg-zinc-700 h-4 w-full rounded-lg animate-pulse">
      </div>

      {/* Actions */}
      <div className="mt-3.5 bg-zinc-700 h-6 w-full rounded-lg animate-pulse">
      </div>
    </div>
  );
};

export default SoundCardSkelton;
