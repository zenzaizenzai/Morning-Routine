import { useState, useEffect } from 'react';
import { RotateCw, Sparkles, Loader2 } from 'lucide-react';
import { TabType, Routine } from './types';
import { TabSwitcher } from './components/TabSwitcher';
import { RoutineCard } from './components/RoutineCard';
import { suggestRoutine } from './services/geminiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('weekday');
  const [dateStr, setDateStr] = useState('');

  // Tab Labels State (Persisted)
  const [tabLabels, setTabLabels] = useState<Record<TabType, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('morning-routine-tabs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse tab labels');
        }
      }
    }
    return {
      weekday: '平日',
      weekend: '休日',
      special: '特別'
    };
  });

  // Initialize from localStorage if available, otherwise use defaults
  const [routines, setRoutines] = useState<Routine[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('morning-routines');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse routines from local storage');
        }
      }
    }
    return [
      { id: '1', title: '水を一杯飲む', completed: true, tab: 'weekday' },
      { id: '2', title: 'ベッドを整える', completed: false, tab: 'weekday' },
      { id: '3', title: '5分間の瞑想', completed: false, tab: 'weekday' },
      { id: '4', title: '今日のタスクを確認', completed: false, tab: 'weekday' },
      { id: '5', title: 'ストレッチ', completed: false, tab: 'weekday' },
      // Weekend examples
      { id: '6', title: 'ゆっくり朝食', completed: false, tab: 'weekend' },
      { id: '7', title: '散歩する', completed: false, tab: 'weekend' },
    ];
  });

  const [newRoutineText, setNewRoutineText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Save to localStorage whenever routines change
  useEffect(() => {
    localStorage.setItem('morning-routines', JSON.stringify(routines));
  }, [routines]);

  // Save tab labels
  useEffect(() => {
    localStorage.setItem('morning-routine-tabs', JSON.stringify(tabLabels));
  }, [tabLabels]);

  useEffect(() => {
    // Format date: "10月26日 (木)"
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
    setDateStr(formatter.format(now));
  }, []);

  const handleToggle = (id: string) => {
    setRoutines(prev => prev.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  // Update text ONLY (keep editing state)
  const handleUpdate = (id: string, newTitle: string) => {
    setRoutines(prev => prev.map(r =>
      r.id === id ? { ...r, title: newTitle } : r
    ));
  };

  // Finish editing
  const handleEditEnd = (id: string) => {
    setRoutines(prev => prev.map(r =>
      r.id === id ? { ...r, isEditing: false } : r
    ));
  };

  const handleEditStart = (id: string) => {
    setRoutines(prev => prev.map(r =>
      r.id === id ? { ...r, isEditing: true } : { ...r, isEditing: false }
    ));
  };

  const handleReset = () => {
    // Reset confirmation removed for smoother UX and to avoid popup blockers
    setRoutines(prev => prev.map(r =>
      r.tab === currentTab ? { ...r, completed: false } : r
    ));
  };

  const handleAddRoutine = () => {
    if (!newRoutineText.trim()) return;

    const newRoutine: Routine = {
      id: Date.now().toString(),
      title: newRoutineText,
      completed: false,
      tab: currentTab,
    };

    setRoutines([...routines, newRoutine]);
    setNewRoutineText('');
  };

  const handleGeminiSuggest = async () => {
    setIsSuggesting(true);
    const suggestion = await suggestRoutine(tabLabels[currentTab]);
    setNewRoutineText(suggestion);
    setIsSuggesting(false);
  };

  const handleTabRename = (tab: TabType, newName: string) => {
    setTabLabels(prev => ({
      ...prev,
      [tab]: newName
    }));
  };

  const visibleRoutines = routines.filter(r => r.tab === currentTab);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background-light">
      {/* Header Section */}
      {/* Added relative and z-10 to ensure header stays on top of the main content's negative margin */}
      <header className="relative bg-teal-100 rounded-b-[2.5rem] pb-8 pt-4 px-6 shadow-sm z-10">
        <div className="text-center mb-6">
          <h1 className="text-xs font-bold text-slate-400 tracking-wider">朝のルーティンプランナー</h1>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">朝のルーティン</h2>
        </div>

        <TabSwitcher
          currentTab={currentTab}
          onChange={setCurrentTab}
          labels={tabLabels}
          onRename={handleTabRename}
        />

        <div className="mt-8 flex justify-between items-center px-1">
          <p className="text-slate-600 font-bold text-lg">{dateStr}</p>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm font-bold text-teal-700 bg-teal-200/50 hover:bg-teal-200/80 transition-colors py-1.5 px-3 rounded-full cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCw size={16} />
            <span>リセット</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      {/* Added relative and z-0 to establish stacking context */}
      <main className="relative flex-grow px-6 -mt-4 pt-10 pb-10 z-0">
        <div className="grid grid-cols-2 gap-4">
          {visibleRoutines.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
            />
          ))}

          {/* New Routine Input Card */}
          <div className="aspect-square rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex flex-col justify-center items-center p-4 relative group hover:border-primary transition-colors">
            <input
              type="text"
              value={newRoutineText}
              onChange={(e) => setNewRoutineText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRoutine()}
              placeholder="新しいルーティン"
              className="w-full bg-transparent text-slate-500 placeholder:text-slate-400 text-lg font-bold text-center border-b-2 border-slate-200 focus:border-primary focus:outline-none p-1 transition-colors"
            />
            {/* AI Suggest Button */}
            <button
              onClick={handleGeminiSuggest}
              disabled={isSuggesting}
              className="absolute top-3 right-3 p-2 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              title="AI Suggestion"
            >
              {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>

            {newRoutineText && (
              <button
                onClick={handleAddRoutine}
                className="mt-2 text-primary text-sm font-bold hover:underline"
              >
                追加
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}