import React, { useRef, useEffect } from 'react';
import { Check, Edit2 } from 'lucide-react';
import { Routine } from '../types';

interface RoutineCardProps {
  routine: Routine;
  onToggle: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
  onEditStart: (id: string) => void;
  onEditEnd: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onToggle,
  onUpdate,
  onEditStart,
  onEditEnd
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (routine.isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [routine.isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const isCompleted = routine.completed;

  if (routine.isEditing) {
    return (
      <div className="aspect-square rounded-3xl bg-gray-50 border-2 border-primary flex flex-col justify-center items-center p-4 shadow-inner">
        <input
          ref={inputRef}
          value={routine.title}
          onChange={(e) => onUpdate(routine.id, e.target.value)}
          onBlur={() => onEditEnd(routine.id)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-slate-800 text-lg font-bold text-center border-b-2 border-primary focus:outline-none p-1"
        />
        <p className="text-xs text-primary mt-2 font-medium">編集中...</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onToggle(routine.id)}
      className={`
        relative group aspect-square rounded-3xl p-4 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 shadow-sm
        ${isCompleted
          ? 'bg-gradient-to-br from-teal-300 to-teal-400 shadow-teal-200/50 text-white transform scale-[1.02]'
          : 'bg-white hover:bg-gray-50 text-slate-700 border border-transparent hover:border-slate-100'}
      `}
    >
      <h3 className={`text-lg font-bold text-center leading-tight px-1 select-none ${isCompleted ? 'text-white' : 'text-slate-700'}`}>
        {routine.title}
      </h3>

      {isCompleted && (
        <div className="absolute top-3 left-3 bg-white/20 rounded-full p-1">
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditStart(routine.id);
        }}
        className={`
          absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${isCompleted ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}
          opacity-0 group-hover:opacity-100
          ${!isCompleted ? '' : 'pointer-events-none'} /* ★この行を追加★ */
        `}
      >
        <Edit2 size={14} />
      </button>
    </div>
  );
};