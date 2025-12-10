// components/Tabs.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="mt-6">
      {/* Mobile dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-gray-100 dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-blue-500"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500 dark:fill-gray-400"
        />
      </div>

      {/* Desktop tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-300/80 dark:border-white/10">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={classNames(
                    isActive
                      ? 'border-blue-400 text-blue-500'
                      : 'border-transparent text-gray-600/90 hover:border-gray-300 hover:text-gray-700 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-gray-300',
                    'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                  )}
                >
                  {Icon && (
                    <Icon
                      aria-hidden="true"
                      className={classNames(
                        isActive
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-zinc-500 dark:group-hover:text-zinc-400',
                        'mr-2 -ml-0.5 size-5',
                      )}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;