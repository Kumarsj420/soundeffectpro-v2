// components/SoundGrid.tsx
import React from 'react';

interface Sound {
  id: number;
  title: string;
  category: string;
  duration: string;
  plays: number;
  likes: number;
  isLiked: boolean;
}

interface SoundGridProps {
  sounds: Sound[];
}

const SoundCard: React.FC<{ sound: Sound }> = ({ sound }) => {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
          {sound.category}
        </span>
        <span className="text-zinc-400 text-sm">{sound.duration}</span>
      </div>
      
      <h3 className="font-medium text-zinc-100 mb-3 line-clamp-2">
        {sound.title}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <span>👥 {sound.plays.toLocaleString()}</span>
        <div className="flex items-center gap-1">
          <span className={sound.isLiked ? 'text-red-500' : ''}>
            {sound.isLiked ? '❤️' : '🤍'}
          </span>
          <span>{sound.likes}</span>
        </div>
      </div>
    </div>
  );
};

const SoundGrid: React.FC<SoundGridProps> = ({ sounds }) => {
  if (sounds.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl p-8 text-center">
        <p className="text-zinc-400">No sounds found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sounds.map((sound) => (
        <SoundCard key={sound.id} sound={sound} />
      ))}
    </div>
  );
};

export default SoundGrid;