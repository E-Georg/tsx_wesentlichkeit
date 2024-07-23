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
  Cells = 'clientStakeholderSignificanceAll',
  Cell = 'clientStakeholderSignificance',
  SubStakeholder = 'clientSubStakeholders',
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
