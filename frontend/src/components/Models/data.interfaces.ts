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
