import React from 'react';
import { TabType } from './types';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'generations', label: 'Generations' },
    { id: 'liked', label: 'Liked' },
    { id: 'brand-archive', label: 'Brand Archive' }
  ];

  return (
    <div className="sticky top-0 bg-white z-10 px-4 pt-4 shadow-sm">
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 pb-4 text-sm font-semibold transition-all relative ${
              activeTab === tab.id ? 'text-black' : 'text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
