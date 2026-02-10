'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
   SpeakerWaveIcon, RectangleGroupIcon
} from '@heroicons/react/24/solid';

import Tabs from '../../../components/Tabs';

export default function searchTab({ search }: { search: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { id: 'sound', label: 'Sounds', icon: SpeakerWaveIcon, path: `/search/${search}` },
        { id: 'soundboard', label: 'Soundboard', icon: RectangleGroupIcon, path: `/search/${search}/soundboard` },
    ];

    const activeTab =
        tabs.find(tab => tab.path === pathname)?.id ?? `/search/${search}`;

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
