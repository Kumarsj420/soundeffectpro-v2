import React from 'react'
import { CardSpan, Para } from './Ui';
import Badge from './Badge';

interface StatItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;

}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value}) => (
    <div className="flex items-start gap-3">
        <Badge variant='secondary' size='auto' className={`mt-0.5 p-2 rounded-lg`}>
            <Icon className={`size-5 text-gray-600 dark:text-zinc-400`} />
        </Badge>
        <div className="flex-1 min-w-0">
            <CardSpan paraHighlight>{label}</CardSpan>
            <Para className="truncate" paraHighlight>
                {value}
            </Para>
        </div>
    </div>
);

export default StatItem
