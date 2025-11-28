import React, { useState, useRef, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { TabType, TABS } from '../types';

interface TabSwitcherProps {
  currentTab: TabType;
  onChange: (tab: TabType) => void;
  labels: Record<TabType, string>;
  onRename: (tab: TabType, newName: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ 
  currentTab, 
  onChange, 
  labels,
  onRename
}) => {
  const [editingTab, setEditingTab] = useState<TabType | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTab && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTab]);

  const startEditing = (tab: TabType, currentLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTab(tab);
    setEditValue(currentLabel);
  };

  const saveEdit = () => {
    if (editingTab && editValue.trim()) {
      onRename(editingTab, editValue.trim());
    }
    setEditingTab(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingTab(null);
    }
  };

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
      
      {TABS.map((tab) => {
        const isActive = currentTab === tab.id;
        const isEditing = editingTab === tab.id;

        return (
          <div 
            key={tab.id}
            className="flex-1 relative z-10"
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm font-bold text-center text-white focus:outline-none py-2.5"
              />
            ) : (
              <button
                onClick={() => onChange(tab.id)}
                className={`w-full flex items-center justify-center gap-1 py-2.5 text-sm font-bold text-center rounded-full transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>{labels[tab.id]}</span>
                {isActive && (
                  <span 
                    onClick={(e) => startEditing(tab.id, labels[tab.id], e)}
                    className="opacity-70 hover:opacity-100 cursor-pointer p-0.5 rounded-full hover:bg-white/20 transition-all"
                  >
                    <Edit2 size={10} />
                  </span>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};