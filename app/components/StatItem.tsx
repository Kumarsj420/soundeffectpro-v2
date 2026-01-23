import React from 'react'

interface StatItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-2 rounded-lg ${highlight
            ? 'bg-blue-50 dark:bg-blue-500/10'
            : 'bg-gray-50 dark:bg-zinc-800'
            }`}>
            <Icon className={`size-5 ${highlight
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-zinc-400'
                }`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-zinc-500">{label}</p>
            <p className="text-base font-medium text-gray-900 dark:text-zinc-100 truncate">
                {value}
            </p>
        </div>
    </div>
);

export default StatItem
