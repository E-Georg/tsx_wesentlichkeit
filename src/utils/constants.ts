import { Classification } from './data.interfaces';

export const DEFAULT_TITLE = 'Default Title';
export const DEFAULT_TEXT = 'Default Text';
export const API_URL = 'https://api.example.com';

export const BUTTONS = {
  SAVE: 'Speichern',
  DELETE: 'Löschen',
  UPDATE: 'Bearbeiten',
};

export const options: Classification[] = [
  { value: 1, label: 'Interner Stackholder' },
  { value: 2, label: 'Externer Stackholder' },
  { value: 3, label: 'Stiller Stackholder' },
];
