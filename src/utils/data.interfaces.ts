export interface Stackholder {
  id: number;
  text: string;
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
  text: string;
  description: string;
}

export enum ClientTypes {
  Stakeholders = "clientStakeholders",
  SubGroups = "clientSubGroups",
  Cells = "clientStakeholderSignificanceAll",
  Cell = "clientStakeholderSignificance",
}
