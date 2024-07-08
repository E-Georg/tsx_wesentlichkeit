import { Cell, ClientTypes, Stackholder, SubGroup } from '../../utils/data.interfaces';
import { Zellen } from '../../utils/data.api';
import {
  AddCellToDatabase,
  AddDataToDatabase,
  DeleteCellFromDatabase,
  DeleteDataFromDatabase,
  fetchData,
  UpdateCellToDatabase,
  UpdateDataToDatabase,
} from '../../services/ApiService';

export const AddStackholder = async (
  text: string,
  description: string,
  columns: Stackholder[],
  setColumns: (column: Stackholder[]) => void,
  clientID: number
) => {
  const stackholder: Stackholder = {
    id: columns.length + 1,
    text: text,
    description: description,
    classification: 1,
  };
  if (stackholder.text !== '') {
    const res = await AddDataToDatabase(stackholder, ClientTypes.Stakeholders, clientID);

    if (res === 200) fetchData(ClientTypes.Stakeholders, setColumns, 2); // setColumns([...columns, stackholder]);
  }
  // Fehlermeldung => gebe Text ein
};

export const AddSubGroup = async (
  title: string,
  text: string,
  rows: SubGroup[],
  setRows: (row: SubGroup[]) => void,
  clientID: number,
  groupID: number
) => {
  const subgroup: SubGroup = {
    id: rows.length + 1,
    text: title,
    description: text,
  };
  if (subgroup.text !== '') {
    const res = await AddDataToDatabase(subgroup, ClientTypes.SubGroups, clientID, groupID);

    if (res === 200) fetchData(ClientTypes.SubGroups, setRows, 2, 1); // setRows([...rows, subgroup]);
  }
  // Fehlermeldung => gebe Text ein
};

export const AddCell = async (
  clientSubGroupId: number,
  clientStakeholderId: number,
  title: string,
  text: string,
  clientID: number,
  cells: Cell[], // depends on the method
  setCells: (cell: Cell[]) => void
) => {
  const newCell: Cell = {
    clientStakeholderId: clientStakeholderId,
    clientSubGroupId: clientSubGroupId,
    id: 0,
    message: {
      title: title,
      text: text,
    },
  };

  if (newCell.message.text !== '' || newCell.message.title !== '') {
    const status = await AddCellToDatabase(newCell, clientID);

    if (status === 200) {
      //fetchCells(ClientTypes.Cells, 2, 1, setCells);
      setCells([...cells, newCell]);
    }
  }
};

export const UpdateSubGroup = async (
  setRows: (row: SubGroup[]) => void,
  rows: SubGroup[],
  id: number,
  text: string,
  description: string,
  clientID: number,
  groupID: number
) => {
  const subGroup: SubGroup = {
    id: id,
    text: text,
    description: description,
  };

  // call API
  const res = await UpdateDataToDatabase(subGroup, ClientTypes.SubGroups, clientID, groupID);
  if (res.return === 1) {
    // TEMPORÄR
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, text: text, description: description };
      }
      return row;
    });
    setRows(updatedRows);
    // oder new Fetch
  }
};

export const UpdateStackholder = async (
  setColumns: (row: Stackholder[]) => void,
  column: Stackholder[],
  id: number,
  text: string,
  description: string,
  clientID: number,
  groupID: number
) => {
  const stackholder: Stackholder = {
    id: id,
    text: text,
    description: description,
  };

  const res = await UpdateDataToDatabase(stackholder, ClientTypes.Stakeholders, clientID, groupID);

  if (res.return == 1) {
    // TEMPORÄR
    const updatedRows = await column.map((col) => {
      if (col.id === id) {
        return { ...col, text: text, description: description };
      }
      return col;
    });
    setColumns(updatedRows);

    // oder new Fetch
  }
};

export const UpdateCell = async (
  setCells: (cell: Cell[]) => void,
  cells: Cell[],
  cellID: [number, number, number],
  title: string,
  text: string
) => {
  const newCell: Cell = {
    id: cellID[2],
    clientStakeholderId: cellID[0],
    clientSubGroupId: cellID[1],
    message: {
      title: title,
      text: text,
    },
  };
  const res = await UpdateCellToDatabase(newCell, cellID[2]);

  console.log(res);
  if (res === 200) {
    const updatedCells = await cells.map((cell) => {
      if (cell.id === cellID[2]) {
        return { ...cell, message: { title: title, text: text }, description: 'description' };
      }
      return cell;
    });
    console.log(cells);
    console.log(updatedCells);
    setCells(updatedCells);
  }
};

export const DeleteSubGroup = async (setRows: (row: SubGroup[]) => void, rows: SubGroup[], id: number) => {
  const res = await DeleteDataFromDatabase(id, ClientTypes.SubGroups);
  if (res === 200) setRows(rows.filter((item) => item.id !== id)); // FetchData(...)
};

export const DeleteStackholder = async (
  setColumns: (row: Stackholder[]) => void,
  columns: Stackholder[],
  id: number
) => {
  const res = await DeleteDataFromDatabase(id, ClientTypes.Stakeholders);
  if (res === 200) setColumns(columns.filter((item) => item.id !== id));
};

export const handleCellClick = (rowId: number, columnId: number) => {
  const zelle = Zellen.find((c) => c.clientStakeholderId === columnId && c.clientSubGroupId === rowId);

  if (zelle?.message.text) console.log('zelle: ', zelle.message.text);
  else console.log({ columnId }, { rowId });
};

export const DeleteCell = async (id: number, setCells: (cell: Cell[]) => void, cells: Cell[]) => {
  const status = await DeleteCellFromDatabase(id);

  if (status === 200) setCells(cells.filter((x: Cell) => x.id !== id));
};

//    <<<<<<<<<< =============== >>>>>>>>>>
//    <<<<<<<<<< =============== >>>>>>>>>>
//    <<<<<<<<<< =============== >>>>>>>>>>
// RELEVANT FÜR DELETE
// const newColumns = columns.filter(stackholder => stackholder.id !== stackholderId);
// setColumns(newColumns);
