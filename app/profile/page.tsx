"use client"
import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import Tabs from '../components/Tabs';
import SoundGrid from '../components/SoundGrid';
import SettingsForm from '../components/SettingsForm';
import SubscriptionCard from '../components/SubscriptionCard';
import { User, Upload, Heart, Settings, Gem } from 'lucide-react';

// Mock data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 
  joinedAt: "2023-01-15"
};

const mockSounds = [
  {
    id: 1,
    title: "Bruh Sound Effect",
    category: "Meme",
    duration: "0:03",
    plays: 1250,
    likes: 89,
    isLiked: true
  },
  {
    id: 2,
    title: "Windows XP Startup",
    category: "Nostalgia",
    duration: "0:06",
    plays: 2100,
    likes: 156,
    isLiked: false
  },
  {
    id: 3,
    title: "Vine Boom",
    category: "Meme",
    duration: "0:01",
    plays: 3400,
    likes: 234,
    isLiked: true
  },
  {
    id: 4,
    title: "Discord Notification",
    category: "Gaming",
    duration: "0:02",
    plays: 890,
    likes: 67,
    isLiked: false
  }
];

const mockUploads = mockSounds.slice(0, 2);
const mockLikes = mockSounds.filter(sound => sound.isLiked);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Uploads', label: 'Uploads', icon: Upload },
    { id: 'Likes', label: 'Likes', icon: Heart },
    { id: 'Settings', label: 'Settings', icon: Settings },
    { id: 'Subscription', label: 'Subscription', icon: Gem }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="bg-zinc-900 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Basic Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-zinc-400 text-sm">Username:</span>
                <p className="text-zinc-200">{mockUser.name}</p>
              </div>
              <div>
                <span className="text-zinc-400 text-sm">Email:</span>
                <p className="text-zinc-200">{mockUser.email}</p>
              </div>
              <div>
                <span className="text-zinc-400 text-sm">Joined:</span>
                <p className="text-zinc-200">{new Date(mockUser.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      
      case 'Uploads':
        return (
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Your Uploads</h3>
            <SoundGrid sounds={mockUploads} />
          </div>
        );
      
      case 'Likes':
        return (
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Liked Sounds</h3>
            <SoundGrid sounds={mockLikes} />
          </div>
        );
      
      case 'Settings':
        return <SettingsForm user={mockUser} />;
      
      case 'Subscription':
        return <SubscriptionCard />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        <ProfileHeader user={mockUser} />
        
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}