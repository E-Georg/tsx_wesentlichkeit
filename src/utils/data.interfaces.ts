export interface Stackholder {
  id: number;
  text: string;
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
}
