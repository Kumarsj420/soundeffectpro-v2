import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2 select-none">
      <div className="flex items-center space-x-0.5">
        <div className="w-0.5 bg-blue-300 rounded-full animate-pulse" 
             style={{ height: '8px', animationDelay: '0ms', animationDuration: '800ms' }}></div>
        <div className="w-0.5 bg-blue-400 rounded-full animate-pulse" 
             style={{ height: '14px', animationDelay: '100ms', animationDuration: '800ms' }}></div>
        <div className="w-0.5 bg-blue-500 rounded-full animate-pulse" 
             style={{ height: '18px', animationDelay: '200ms', animationDuration: '800ms' }}></div>
        <div className="w-0.5 bg-blue-400 rounded-full animate-pulse" 
             style={{ height: '12px', animationDelay: '300ms', animationDuration: '800ms' }}></div>
        <div className="w-0.5 bg-blue-300 rounded-full animate-pulse" 
             style={{ height: '10px', animationDelay: '400ms', animationDuration: '800ms' }}></div>
      </div>

      <div className="relative">
        <span className="text-lg font-bold text-zinc-200 tracking-tight">
          SOUND EFFECT
        </span>
        <span className="absolute -top-2 -right-7 text-xs font-bold text-blue-400 tracking-tight">
          PRO
        </span>
      </div>
    </div>
  );
}