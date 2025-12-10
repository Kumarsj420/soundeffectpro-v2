"use client"
import { useState } from 'react';
import { Share2, Music } from 'lucide-react';
import SoundCard, { SoundCardProps } from '../components/SoundCard';

// Types
interface Soundboard {
    id: string;
    title: string;
    thumbnail: string | null;
    totalSounds: number;
    totalViews: number;
    sounds: SoundCardProps[];
}

// Dummy soundboard data
const soundboardData: Soundboard = {
    id: '1',
    title: 'Epic Meme Collection',
    thumbnail: null,
    totalSounds: 12,
    totalViews: 3200,
    sounds: [
        {
            id: 1,
            title: "Rick Roll Classic",
            duration: "0:10",
            likes: 1200,
            downloads: 890,
            tag: "Meme",
        },
        {
            id: 2,
            title: "Bruh Sound Effect",
            duration: "0:02",
            likes: 850,
            downloads: 620,
            tag: "Meme",
        },
        {
            id: 3,
            title: "Wilhelm Scream",
            duration: "0:03",
            likes: 2100,
            downloads: 1500,
            tag: "Classic",
        },
        {
            id: 4,
            title: "Vine Boom",
            duration: "0:01",
            likes: 3400,
            downloads: 2800,
            tag: "Meme",
        },
        {
            id: 5,
            title: "OOF Sound",
            duration: "0:01",
            likes: 1800,
            downloads: 1200,
            tag: "Gaming",
        },
        {
            id: 6,
            title: "Sad Trombone",
            duration: "0:05",
            likes: 920,
            downloads: 450,
            tag: "Comedy",
        },
        {
            id: 7,
            title: "Air Horn",
            duration: "0:02",
            likes: 1500,
            downloads: 980,
            tag: "Meme",
        },
        {
            id: 8,
            title: "Dramatic Chipmunk",
            duration: "0:04",
            likes: 670,
            downloads: 340,
            tag: "Classic",
        },
        {
            id: 9,
            title: "To Be Continued",
            duration: "0:08",
            likes: 2200,
            downloads: 1700,
            tag: "Anime",
        },
        {
            id: 10,
            title: "Windows XP Startup",
            duration: "0:06",
            likes: 1100,
            downloads: 890,
            tag: "Nostalgia",
        },
        {
            id: 11,
            title: "FBI Open Up",
            duration: "0:03",
            likes: 1650,
            downloads: 1100,
            tag: "Meme",
        },
        {
            id: 12,
            title: "John Cena Theme",
            duration: "0:15",
            likes: 2800,
            downloads: 2100,
            tag: "Meme",
        }
    ]
};

// Utility function to format numbers
const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};

// Main Soundboard Page
export default function SoundboardPage() {
    const handleShareBoard = async (): Promise<void> => {
        console.log('Sharing soundboard');

        if (navigator.share) {
            try {
                await navigator.share({
                    title: soundboardData.title,
                    text: `Check out this soundboard with ${soundboardData.totalSounds} awesome sounds!`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.log('Copy failed:', err);
            }
        }
    };

    return (
        <div className="min-h-screen text-gray-900 dark:text-zinc-100">
            <div>
                {/* Soundboard Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Thumbnail */}
                    <div className="aspect-square w-40 h-40 bg-white dark:bg-zinc-900 rounded-xl shadow-lg shadow-gray-300 dark:shadow-zinc-900 flex items-center justify-center flex-shrink-0">
                        {soundboardData.thumbnail ? (
                            <img
                                src={soundboardData.thumbnail}
                                alt={soundboardData.title}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <Music className="w-16 h-16 text-gray-400 dark:text-zinc-600" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 overflow-hidden">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                            {soundboardData.title}
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 mb-4">
                            {soundboardData.totalSounds} Sounds · {formatNumber(soundboardData.totalViews)} Views
                        </p>
                        <button
                            onClick={handleShareBoard}
                            className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-3 py-2 mt-2 flex items-center gap-2 transition"
                        >
                            <Share2 className="w-4 h-4" />
                            Share Board
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 dark:border-zinc-800 my-6"></div>

                {/* Sounds Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Sounds in this Board</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {soundboardData.sounds.map((sound) => (
                            <SoundCard key={`soundboard-${sound.id}`} {...sound} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}