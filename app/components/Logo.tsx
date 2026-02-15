'use client'
import React from 'react';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2 select-none">
      <img src="/licon.webp" alt="logo icon" className='size-8' />

      <div className="relative py-2">
        <span className="text-lg font-extrabold  dark:text-zinc-200 tracking-tight">
          SOUND <span className='font-medium'>EFFECT</span>
        </span>
        <div className="wrapper ten absolute top-0 right-0 -translate-y-12 translate-x-8.5">
          <span>
            <span className="text-bounce text-xs font-extrabold text-blue-500 dark:text-blue-200">
              <span>P</span>
              <span>R</span>
              <span>O</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}