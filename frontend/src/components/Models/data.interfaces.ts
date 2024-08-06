import { SurveyText } from '../../store';

export interface Stakeholder {
  id: number;
  title: string;
  description: string;
  classification?: number;
  relevance?: number;
  relevanceText?: string;
}

export interface Cell {
  clientStakeholderId: number;
  clientGroupId: number;
  clientSubGroupId: number;
  id: number;
  message: [
    {
      id: number;
      title: string;
      text: string;
      subStakeholderId: number;
    }
  ];
}

export interface SubGroup {
  id: number;
  title: string;
  description: string;
}

export interface Group {
  id: number;
  title: string;
  description: string;
}
export interface SubStakeholder {
  id: number;
  name: string;
  email: string;
  stakeholderId: number;
  stakeholderName?: string;
}

export enum ClientTypes {
  Stakeholders = 'clientStakeholders',
  SubGroups = 'clientSubGroups',
  Groups = 'clientGroups',
  GroupSubGroup = 'clientGroupSubGroup',
  Cells = 'clientStakeholderSignificanceAll',
  Cell = 'clientStakeholderSignificance',
  SubStakeholder = 'clientSubStakeholders',
  SurveyQuestions = 'SurveyQuestions',
}

export enum HttpAction {
  DELETE = 'd',
  UPDATE = 'e',
  POST = 'i',
  DEFAULT = '',
}

export interface Classification {
  value: number;
  label: string;
}

export type Relevance = {
  value: number;
  label: string;
};

export interface Question {
  id: number;
  value: string;
}

export interface SurveyQuestion {
  groupId: number;
  groupTitle: string;
  subGroupId: number;
  subGroupTitle: string;
  questions: Question;
}

export type SurveyAnswer = {
  subGroupId: number;
  answer: number;
};

export type AddSurveyQuestionAnswersParams = {
  subStakeholderID: number;
  clientId?: number;
  message: SurveyAnswer[];
  comment: SurveyText[];
};

export type VisibleDescription = {
  [key: number]: boolean;
};

export type SetSelectedValues = React.Dispatch<React.SetStateAction<SurveyAnswer[]>>;

export type SetVisibleDescription = React.Dispatch<React.SetStateAction<VisibleDescription>>;

export interface VorbewertungRow {
  ID: number;
  'ESRS-Thema': string;
  Unterthema: string;
  Betrachtungsfall: string;
  Stakeholdererwähnung: string;
  'Einordung: Finanziell': string;
  'Einordnung: Auswirkung': string;
  'Einordnung: Eintrittswahrscheinlichkeit (Eintrittswirkung)': string;
  'Ort der Wertschöpfungskette': string;
  'Grund der verursachten Wirkung': string;
  'Was muss eintreten, damit dies so eintritt': string;
  'Betroffene Systemgrenzen': string;
}

export const VorbewertungColumns = [
  { label: 'ID' },
  { label: 'ESRS-Thema' },
  { label: 'Unterthema' },
  { label: 'Betrachtungsfall' },
  { label: 'Stakeholdererwähnung' },
  { label: 'Einordung: Finanziell' },
  { label: 'Einordnung: Auswirkung' },
  { label: 'Einordung: Eintrittswahrscheinlichkeit (Eintrittswirkung)' },
  { label: 'Ort der Wertschöpfungskette' },
  { label: 'Grund der verursachten Wirkung' },
  { label: 'Was muss eintreten, damit dies so eintritt' },
  { label: 'Betroffene Systemgrenzen' },
];

export const VorbewertungData: VorbewertungRow[] = [
  {
    ID: 1,
    'ESRS-Thema': 'Thema A',
    Unterthema: 'Unterthema A1',
    Betrachtungsfall: 'Fall A',
    Stakeholdererwähnung: 'Stakeholder 1',
    'Einordung: Finanziell': 'Hoch',
    'Einordnung: Auswirkung': 'Mittel',
    'Einordnung: Eintrittswahrscheinlichkeit (Eintrittswirkung)': 'Gering',
    'Ort der Wertschöpfungskette': 'Produktion',
    'Grund der verursachten Wirkung': 'Hohe Nachfrage',
    'Was muss eintreten, damit dies so eintritt': 'Marktveränderung',
    'Betroffene Systemgrenzen': 'System A',
  },
  {
    ID: 2,
    'ESRS-Thema': 'Thema B',
    Unterthema: 'Unterthema B1',
    Betrachtungsfall: 'Fall B',
    Stakeholdererwähnung: 'Stakeholder 2',
    'Einordung: Finanziell': 'Mittel',
    'Einordnung: Auswirkung': 'Hoch',
    'Einordnung: Eintrittswahrscheinlichkeit (Eintrittswirkung)': 'Mittel',
    'Ort der Wertschöpfungskette': 'Vertrieb',
    'Grund der verursachten Wirkung': 'Wirtschaftliche Lage',
    'Was muss eintreten, damit dies so eintritt': 'Regulatorische Änderungen',
    'Betroffene Systemgrenzen': 'System B',
  },
  {
    ID: 3,
    'ESRS-Thema': 'Thema C',
    Unterthema: 'Unterthema C1',
    Betrachtungsfall: 'Fall C',
    Stakeholdererwähnung: 'Stakeholder 3',
    'Einordung: Finanziell': 'Gering',
    'Einordnung: Auswirkung': 'Gering',
    'Einordnung: Eintrittswahrscheinlichkeit (Eintrittswirkung)': 'Hoch',
    'Ort der Wertschöpfungskette': 'R&D',
    'Grund der verursachten Wirkung': 'Technologische Innovation',
    'Was muss eintreten, damit dies so eintritt': 'Forschungserfolge',
    'Betroffene Systemgrenzen': 'System C',
  },
];
