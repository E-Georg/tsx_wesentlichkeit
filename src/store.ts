import { create } from 'zustand';
import { HttpAction } from './utils/data.interfaces';
import { devtools } from 'zustand/middleware';

/// ================================================

interface State {
  DELETE: boolean;
  title: string;
  text: string;
  classification: number;
  showModal: boolean;
  onChangeSubGroup: { mode: HttpAction; ID: number };
  onChangeStackholder: { mode: HttpAction; ID: number };
  onChangeCells: { mode: HttpAction; ID: number };
  cellID: [number, number, number];
  ClientID: number;
  GroupID: number;
}

interface Action {
  SetDELETE: () => void;
  setTitle: (title: string) => void;
  setText: (text: string) => void;
  setClassification: (num: number) => void;
  setShowModal: () => void;
  setOnChangeSubGroup: (mode: HttpAction, ID: number) => void;
  setOnChangeStackholder: (mode: HttpAction, ID: number) => void;
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
    title: '',
    setTitle: (title: string) => set(() => ({ title: title })),
    text: '',
    setText: (text: string) => set(() => ({ text: text })),
    classification: 0,
    setClassification: (num: number) => set(() => ({ classification: num })),
    showModal: false,
    setShowModal: () => set((state) => ({ showModal: !state.showModal })),
    onChangeSubGroup: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeSubGroup: (mode: HttpAction, ID: number) => set(() => ({ onChangeSubGroup: { mode: mode, ID: ID } })),
    onChangeStackholder: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeStackholder: (mode: HttpAction, ID: number) =>
      set(() => ({ onChangeStackholder: { mode: mode, ID: ID } })),
    onChangeCells: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeCells: (mode: HttpAction, ID: number) => set(() => ({ onChangeCells: { mode: mode, ID: ID } })),
    cellID: [0, 0, 0],
    setCellID: (cellID: [number, number, number]) => set(() => ({ cellID: cellID })),
    reset: () =>
      set((state) => ({
        title: '',
        text: '',
        classification: 0,
        showModal: false,
        onChangeSubGroup: { mode: HttpAction.DEFAULT, ID: state.onChangeSubGroup.ID },
        onChangeStackholder: { mode: HttpAction.DEFAULT, ID: state.onChangeStackholder.ID },
        onChangeCells: { mode: HttpAction.DEFAULT, ID: state.onChangeCells.ID },
      })),
    ClientID: 2,
    GroupID: 1,
    setClientID: (id: number) => set(() => ({ ClientID: id })),
    setGroupID: (id: number) => set(() => ({ GroupID: id })),
  }))
);
