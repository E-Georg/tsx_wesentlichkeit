import { create } from 'zustand';
import { HttpAction, Stakeholder } from './utils/data.interfaces';
import { devtools } from 'zustand/middleware';

/// ================================================

interface State {
  DELETE: boolean;
  columns: Stakeholder[];
  title: string;
  description: string;
  classification: number | null;
  showModal: boolean;
  onChangeSubGroup: { mode: HttpAction; ID: number };
  onChangeStakeholder: { mode: HttpAction; ID: number };
  onChangeCells: { mode: HttpAction; ID: number };
  cellID: [number, number, number];
  ClientID: number;
  GroupID: number;
}

interface Action {
  setColumns: (columns: Stakeholder[]) => void;
  SetDELETE: () => void;
  setTitle: (title: string) => void;
  setDescription: (text: string) => void;
  setClassification: (num: number) => void;
  setShowModal: () => void;
  setOnChangeSubGroup: (mode: HttpAction, ID: number) => void;
  setOnChangeStakeholder: (mode: HttpAction, ID: number) => void;
  setOnChangeCells: (mode: HttpAction, ID: number) => void;
  setCellID: (cellID: [number, number, number]) => void;
  setClientID: (id: number) => void;
  setGroupID: (id: number) => void;
  reset: () => void;
}

export const useStore = create<State & Action>()(
  devtools((set) => ({
    DELETE: false,
    SetDELETE: () => set((state) => ({ DELETE: !state.DELETE })),
    columns: [],
    setColumns: (columns: Stakeholder[]) => set(() => ({ columns: columns })),
    title: '',
    setTitle: (title: string) => set(() => ({ title: title })),
    description: '',
    setDescription: (text: string) => set(() => ({ description: text })),
    classification: null,
    setClassification: (num: number) => set(() => ({ classification: num })),
    showModal: false,
    setShowModal: () => set((state) => ({ showModal: !state.showModal })),
    onChangeSubGroup: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeSubGroup: (mode: HttpAction, ID: number) => set(() => ({ onChangeSubGroup: { mode: mode, ID: ID } })),
    onChangeStakeholder: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeStakeholder: (mode: HttpAction, ID: number) =>
      set(() => ({ onChangeStakeholder: { mode: mode, ID: ID } })),
    onChangeCells: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeCells: (mode: HttpAction, ID: number) => set(() => ({ onChangeCells: { mode: mode, ID: ID } })),
    cellID: [0, 0, 0],
    setCellID: (cellID: [number, number, number]) => set(() => ({ cellID: cellID })),
    reset: () =>
      set((state) => ({
        title: '',
        description: '',
        classification: null,
        showModal: false,
        onChangeSubGroup: { mode: HttpAction.DEFAULT, ID: state.onChangeSubGroup.ID },
        onChangeStakeholder: { mode: HttpAction.DEFAULT, ID: state.onChangeStakeholder.ID },
        onChangeCells: { mode: HttpAction.DEFAULT, ID: state.onChangeCells.ID },
      })),
    ClientID: 2,
    GroupID: 1,
    setClientID: (id: number) => set(() => ({ ClientID: id })),
    setGroupID: (id: number) => set(() => ({ GroupID: id })),
  }))
);
