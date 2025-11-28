import React from 'react';
import { TabType, TABS } from '../types';

interface TabSwitcherProps {
  currentTab: TabType;
  onChange: (tab: TabType) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ currentTab, onChange }) => {
  return (
    <div className="mt-6 relative bg-white rounded-full p-1.5 shadow-sm flex items-center justify-between overflow-hidden">
      {/* Animated Background Pill */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-primary rounded-full transition-all duration-300 ease-out shadow-md"
        style={{
            width: `calc(33.333% - 6px)`,
            left: currentTab === 'weekday' ? '4px' : currentTab === 'weekend' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 0px)',
            transform: currentTab === 'special' ? 'translateX(-2px)' : 'none'
        }}
      />
      
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 relative z-10 py-2.5 text-sm font-bold text-center rounded-full transition-colors duration-200 ${
            currentTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};