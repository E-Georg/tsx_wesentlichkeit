import { create } from 'zustand';
import { Cell, Stackholder, SubGroup } from './utils/data.interfaces';
import { initialColumns, initialRows, Zellen } from './utils/data.api';

/// ===================== MATRIX.tsx ===========================

interface MatrixState {
  showModal: boolean;
  setShowModal: () => void;
  stackholder: boolean;
  setStackholder: () => void;
  subGroup: boolean;
  setSubGroup: () => void;
  cell: boolean;
  setCell: () => void;
  onUpdateRow: { show: boolean; clickedRowId: number };
  setOnUpdateRow: (show: boolean, clickedRowId: number) => void;
  onUpdateStackholder: { show: boolean; clickedColId: number };
  setOnUpdateStackholder: (show: boolean, clickedColId: number) => void;
  cellID: [number, number];
  setCellID: (cellID: [number, number]) => void;
}

export const useMatrixStore = create<MatrixState>((set) => ({
  showModal: false,
  setShowModal: () => set((state) => ({ showModal: !state.showModal })), // Man könnte alle werte auf false setzen, dann hat man eine art reset
  stackholder: false,
  setStackholder: () => set((state) => ({ stackholder: !state.stackholder })),
  subGroup: false,
  setSubGroup: () => set((state) => ({ subGroup: !state.subGroup })),
  cell: false,
  setCell: () => set((state) => ({ cell: !state.cell })),
  onUpdateRow: { show: false, clickedRowId: 0 },
  setOnUpdateRow: (show: boolean, clickedRowId: number) => set(() => ({ onUpdateRow: { show: show, clickedRowId: clickedRowId } })),
  onUpdateStackholder: { show: false, clickedColId: 0 },
  setOnUpdateStackholder: (show: boolean, clickedColId: number) => set(() => ({ onUpdateStackholder: { show: show, clickedColId: clickedColId } })),
  cellID: [0, 0],
  setCellID: (cellID: [number, number]) => set(() => ({ cellID: cellID })),
}));

/// ===================== MATRIXCONTAINER.tsx ===========================

interface MatrixContainerState {
  count: number;
  increment: () => void;
  decrement: () => void;
  title: string;
  setTitle: (title: string) => void;
  text: string;
  setText: (text: string) => void;
  ClientID: number;
  GroupID: number;
  rows: SubGroup[];
  setRows: (row: SubGroup[]) => void;
  columns: Stackholder[];
  setColumns: (column: Stackholder[]) => void;
  cells: Cell[];
  setCells: (cell: Cell[]) => void;
}

export const useMatrixContainerStore = create<MatrixContainerState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  title: '',
  setTitle: (title: string) => set(() => ({ title: title })),
  text: '',
  setText: (text: string) => set(() => ({ text: text })),
  ClientID: 2,
  GroupID: 1,
  rows: initialRows,
  setRows: (rows: SubGroup[]) => set({ rows: rows }),
  columns: initialColumns,
  setColumns: (col: Stackholder[]) => set({ columns: col }),
  cells: Zellen,
  setCells: (cells: Cell[]) => set({ cells: cells }),
}));

/// ===================== NEU.tsx ===========================
