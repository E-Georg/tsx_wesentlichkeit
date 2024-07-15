import { create } from 'zustand';
import { HttpAction } from './utils/data.interfaces';
import { devtools } from 'zustand/middleware';
import { subStakeholderList } from './utils/data.api';

/// ================================================
// setCellID([row.id, column.id, idOfCell]);
export type CellID = {
  rowID: number;
  coolumnID: number;
  cellID: number;
};

export type ChangeObject = {
  mode: HttpAction;
  ID: number;
};
interface State {
  SubStakeholder: any[];
  DELETE: boolean;
  title: string;
  description: string;
  classification: number;
  showModal: boolean;
  onChangeSubGroup: ChangeObject;
  onChangeStakeholder: ChangeObject;
  onChangeCells: ChangeObject;
  cellID: CellID;
  ClientID: number;
  GroupID: number;
}

interface Action {
  setSubStakeholder: (data: any) => void;
  SetDELETE: () => void;
  setTitle: (title: string) => void;
  setDescription: (text: string) => void;
  setClassification: (num: number) => void;
  setShowModal: () => void;
  setOnChangeSubGroup: (obj: ChangeObject) => void;
  setOnChangeStakeholder: (obj: ChangeObject) => void;
  setOnChangeCells: (obj: ChangeObject) => void;
  setCellID: (cellID: CellID) => void;
  setClientID: (id: number) => void;
  setGroupID: (id: number) => void;
  reset: () => void;
}

export const useStore = create<State & Action>()(
  devtools((set) => ({
    SubStakeholder: subStakeholderList,
    setSubStakeholder: (data: any) => set((state) => ({ SubStakeholder: [...state.SubStakeholder, data] })),
    DELETE: false,
    SetDELETE: () => set((state) => ({ DELETE: !state.DELETE })),
    title: '',
    setTitle: (title: string) => set(() => ({ title: title })),
    description: '',
    setDescription: (text: string) => set(() => ({ description: text })),
    classification: 9,
    setClassification: (num: number) => set(() => ({ classification: num })),
    showModal: false,
    setShowModal: () => set((state) => ({ showModal: !state.showModal })),
    onChangeSubGroup: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeSubGroup: (obj: ChangeObject) => set(() => ({ onChangeSubGroup: obj })),
    onChangeStakeholder: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeStakeholder: (obj: ChangeObject) => set(() => ({ onChangeStakeholder: obj })),
    onChangeCells: { mode: HttpAction.DEFAULT, ID: 0 },
    setOnChangeCells: (obj: ChangeObject) => set(() => ({ onChangeCells: obj })),
    cellID: { rowID: 0, coolumnID: 0, cellID: 0 },
    setCellID: (cellID: CellID) => set(() => ({ cellID: cellID })),
    reset: () =>
      set((state) => ({
        title: '',
        description: '',
        classification: 9,
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
