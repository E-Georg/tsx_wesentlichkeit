import { Classification, Relevance } from '../components/Models/data.interfaces';

export const DEFAULT_TITLE = 'Default Title';
export const DEFAULT_TEXT = 'Default Text';
export const API_URL = 'https://api.example.com';

export const BUTTONS = {
  SAVE: 'Speichern',
  DELETE: 'Löschen',
  UPDATE: 'Bearbeiten',
};

export const options: Classification[] = [
  { value: 1, label: 'Interner Stakeholder' },
  { value: 2, label: 'Externer Stakeholder' },
  { value: 3, label: 'Stiller Stakeholder' },
  { value: 4, label: 'not defined' },
];

export const relevances: Relevance[] = [
  { value: 1, label: 'Relevant' },
  { value: 2, label: 'Unrelevant' },
  { value: 3, label: 'not defined' },
];
