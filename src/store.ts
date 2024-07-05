import { create } from 'zustand';
import { Cell, Stackholder, SubGroup } from './utils/data.interfaces';
import { initialColumns, initialRows, Zellen } from './utils/data.api';
import { devtools } from 'zustand/middleware';

/// ===================== MATRIX.tsx ===========================

interface State {
  title: string;
  text: string;
  showModal: boolean;
  column: boolean;
  row: boolean;
  cell: boolean;
  onUpdateRow: { show: boolean; clickedRowId: number };
  onUpdateColumn: { show: boolean; clickedColId: number };
  cellID: [number, number, number];
  ClientID: number;
  GroupID: number;
  rows: SubGroup[];
  columns: Stackholder[];
  cells: Cell[];
}

interface Action {
  setTitle: (title: string) => void;
  setText: (text: string) => void;
  setShowModal: () => void;
  setColumn: () => void;
  setRow: () => void;
  setCell: () => void;
  setOnUpdateRow: (show: boolean, clickedRowId: number) => void;
  setOnUpdateColumn: (show: boolean, clickedColId: number) => void;
  setCellID: (cellID: [number, number, number]) => void;
  reset: () => void;
  setRows: (row: SubGroup[]) => void;
  setColumns: (column: Stackholder[]) => void;
  setCells: (cell: Cell[]) => void;
}

export const useStore = create<State & Action>()(
  devtools((set) => ({
    title: '',
    setTitle: (title: string) => set(() => ({ title: title })),
    text: '',
    setText: (text: string) => set(() => ({ text: text })),
    showModal: false,
    setShowModal: () => set((state) => ({ showModal: !state.showModal })),
    column: false,
    setColumn: () => set((state) => ({ column: !state.column })),
    row: false,
    setRow: () => set((state) => ({ row: !state.row })),
    cell: false,
    setCell: () => set((state) => ({ cell: !state.cell })),
    onUpdateRow: { show: false, clickedRowId: 0 },
    setOnUpdateRow: (show: boolean, clickedRowId: number) =>
      set(() => ({ onUpdateRow: { show: show, clickedRowId: clickedRowId } })),
    onUpdateColumn: { show: false, clickedColId: 0 },
    setOnUpdateColumn: (show: boolean, clickedColId: number) =>
      set(() => ({ onUpdateColumn: { show: show, clickedColId: clickedColId } })),
    cellID: [0, 0, 0],
    setCellID: (cellID: [number, number, number]) => set(() => ({ cellID: cellID })),
    reset: () =>
      set((state) => ({
        title: '',
        text: '',
        cell: false,
        row: false,
        column: false,
        showModal: false,
        onUpdateColumn: { show: false, clickedColId: state.onUpdateColumn.clickedColId },
        onUpdateRow: { show: false, clickedRowId: state.onUpdateRow.clickedRowId },
      })),
    ClientID: 2,
    GroupID: 1,
    rows: initialRows,
    setRows: (rows: SubGroup[]) => set({ rows: rows }),
    columns: initialColumns,
    setColumns: (col: Stackholder[]) => set({ columns: col }),
    cells: Zellen,
    setCells: (cells: Cell[]) => set({ cells: cells }),
  }))
);
