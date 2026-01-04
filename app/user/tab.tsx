'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowUpOnSquareStackIcon,
  HeartIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/solid';

import Tabs from '../components/Tabs';

export default function Tab() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: UserIcon, path: '/user' },
    { id: 'Uploads', label: 'Uploads', icon: ArrowUpOnSquareStackIcon, path: '/user/uploads' },
    { id: 'Likes', label: 'Likes', icon: HeartIcon, path: '/user/likes' },
    { id: 'Soundboards', label: 'Soundboards', icon: RectangleGroupIcon, path: '/user/soundboards' },
    { id: 'Settings', label: 'Settings', icon: Cog6ToothIcon, path: '/user/settings' },
  ];

  const activeTab =
    tabs.find(tab => tab.path === pathname)?.id ?? 'Profile';

  return (
    
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) router.push(tab.path);
      }}
    />
  );
}
