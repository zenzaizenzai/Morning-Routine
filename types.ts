export type TabType = 'weekday' | 'weekend' | 'special';

export interface Routine {
  id: string;
  title: string;
  completed: boolean;
  tab: TabType;
  isEditing?: boolean;
}

export const TABS: { id: TabType; label: string }[] = [
  { id: 'weekday', label: '平日' },
  { id: 'weekend', label: '休日' },
  { id: 'special', label: '特別' },
];