import { Classification, Relevance } from '../components/Models/data.interfaces';

export const DEFAULT_TITLE = 'Default Title';
export const DEFAULT_TEXT = 'Default Text';
export const API_URL = 'https://api.example.com';

export const BUTTONS = {
  SAVE: 'Speichern',
  DELETE: 'Löschen',
  UPDATE: 'Bearbeiten',
};

export const Classifications: Classification[] = [
  { value: 1, label: 'Interner Stakeholder' },
  { value: 2, label: 'Externer Stakeholder' },
  { value: 3, label: 'Stiller Stakeholder' },
  { value: 5, label: 'Nicht definiert' },
];

export const Relevances: Relevance[] = [
  { value: 1, label: 'Relevant' },
  { value: 2, label: 'Unrelevant' },
  { value: 5, label: 'Nicht definiert' },
];

export const COLORS = {
  BACKGROUND_LIGHT: 'White',
  BACKGROUND_DARK: '#0014432',
  PRIMARY: '#83C1E8',
  SECONDARY: '#58a9DC',
  TERTIARY: '#0082C8',
};

export const Importance = [{ answer: -2 }, { answer: -1 }, { answer: 0 }, { answer: 1 }, { answer: 2 }];
