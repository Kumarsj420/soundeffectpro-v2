import React from 'react'
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  badge?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, badge = false }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
    <div className="flex items-center gap-3">
      <Icon className="size-5 text-gray-400 dark:text-zinc-500" />
      <span className="text-sm text-gray-600 dark:text-zinc-400">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900 dark:text-zinc-200">
        {value}
      </span>
      {badge && (
        <CheckBadgeIcon className="size-5 text-green-500" />
      )}
    </div>
  </div>
);

export default InfoRow
