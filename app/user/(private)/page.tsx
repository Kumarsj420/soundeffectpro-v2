'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { userService } from '@/app/services/userService';
import { useQuery } from '@tanstack/react-query';
import Card from '@/app/components/Card';
import {
  CalendarIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  HeartIcon,
  DocumentIcon,
  ClockIcon,
  CheckBadgeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import StatItem from '@/app/components/StatItem';
import InfoRow from '@/app/components/InfoRow';

function Page() {
  const { data: session } = useSession();

  const uid = session?.user?.uid;

  const {
    data: userData,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user", uid],
    queryFn: () => userService.getUserByUID(uid!),
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  });

  const userInfo = userData?.data ?? null;

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccountAge = (createdAt: string | Date): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'zh': 'Chinese'
    };
    return languages[code] || code.toUpperCase();
  };

  const getThemeDisplay = (theme: string): string => {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const getProviderDisplay = (provider: string): string => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500 dark:text-zinc-400">Loading profile...</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-red-500">Failed to load user profile</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <UserCircleIcon className="size-5 text-gray-700 dark:text-zinc-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Account Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatItem
            icon={MusicalNoteIcon}
            label="Soundboards"
            value={userInfo.categoriesCount || 0}
            highlight
          />
          <StatItem
            icon={DocumentIcon}
            label="Audio Files"
            value={userInfo.filesCount || 0}
            highlight
          />
          <StatItem
            icon={HeartIcon}
            label="Favorites"
            value={userInfo.favCount || 0}
          />
          <StatItem
            icon={ClockIcon}
            label="Member Since"
            value={getAccountAge(userInfo.createdAt)}
          />
        </div>
      </Card>

      {/* Account Details */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Cog6ToothIcon className="size-5 text-gray-700 dark:text-zinc-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Account Details
          </h2>
        </div>

        <div className="space-y-0">
          {userInfo?.createdAt && (
            <InfoRow
              icon={CalendarIcon}
              label="Joined"
              value={formatDate(userInfo?.createdAt)}
            />
          )}
          {
            userInfo?.updatedAt && (
              <InfoRow
                icon={CalendarIcon}
                label="Last Updated"
                value={formatDate(userInfo?.updatedAt)}
              />
            )
          }
          <InfoRow
            icon={CheckBadgeIcon}
            label="Email Verified"
            value={userInfo.emailVerified ? formatDate(userInfo.emailVerified) : 'Not Verified'}
            badge={!!userInfo.emailVerified}
          />
          <InfoRow
            icon={GlobeAltIcon}
            label="Sign-in Provider"
            value={getProviderDisplay(userInfo?.provider || '-')}
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Cog6ToothIcon className="size-5 text-gray-700 dark:text-zinc-300" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Preferences
          </h2>
        </div>

        <div className="space-y-0">
          <InfoRow
            icon={GlobeAltIcon}
            label="Theme"
            value={getThemeDisplay(userInfo.preference.theme)}
          />
          <InfoRow
            icon={LanguageIcon}
            label="Language"
            value={getLanguageName(userInfo.preference.language)}
          />
          <InfoRow
            icon={CheckBadgeIcon}
            label="Cookies"
            value={userInfo.preference.cookies ? 'Enabled' : 'Disabled'}
          />
          <InfoRow
            icon={CheckBadgeIcon}
            label="Profile Status"
            value={userInfo.isProfileCompleted ? 'Completed' : 'Incomplete'}
            badge={userInfo.isProfileCompleted}
          />
        </div>
      </Card>

      {/* Activity Summary */}
      <Card >
        <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
          Activity Summary
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-1">
          {(userInfo.categoriesCount || 0) + (userInfo.filesCount || 0) + (userInfo.favCount || 0)}
        </p>
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Total interactions across soundboards, uploads, and favorites
        </p>
      </Card>
    </div>
  )
}

export default Page