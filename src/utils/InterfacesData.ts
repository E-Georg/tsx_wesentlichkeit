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

export const Zellen: Cell[] = [
  {
    stackholderID: 1,
    subGroupID: 1,
    message: { text: "", date: "2023-01-05" },
  },
  {
    stackholderID: 1,
    subGroupID: 2,
    message: { text: "Hello", date: "2023-01-05" },
  },
  {
    stackholderID: 2,
    subGroupID: 1,
    message: { text: "World", date: "2023-01-05" },
  },
];

export const initialRows: SubGroup[] = [
  {
    id: 1,
    name: "Row 1",
  },
  {
    id: 2,
    name: "Row 2",
  },
  // Add more rows as needed
];

export const initialColumns: Stackholder[] = [
  { id: 1, name: "Stackholder 1" },
  { id: 2, name: "Stackholder 2" },
  // Add more columns as needed
];
