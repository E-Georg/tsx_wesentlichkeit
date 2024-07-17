export interface Stakeholder {
  id: number;
  title: string;
  description: string;
  classification?: number;
}

export interface Cell {
  clientStakeholderId: number;
  clientSubGroupId: number;
  id: number;
  message: {
    title: string;
    text: string;
  };
}

export interface SubGroup {
  id: number;
  title: string;
  description: string;
}

export enum ClientTypes {
  Stakeholders = 'clientStakeholders',
  SubGroups = 'clientSubGroups',
  Cells = 'clientStakeholderSignificanceAll',
  Cell = 'clientStakeholderSignificance',
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
