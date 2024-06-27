export interface Stackholder {
  id: number;
  name: string;
}

export interface Cell {
  stackholderID: number;
  subGroupID: number;
  message: {
    text: string;
    date: string;
  };
}

export interface SubGroup {
  id: number;
  name: string;
}
