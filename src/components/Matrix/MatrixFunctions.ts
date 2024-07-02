import {
  Cell,
  ClientTypes,
  Stackholder,
  SubGroup,
} from "../../utils/data.interfaces";
import { Zellen } from "../../utils/data.api";
import {
  AddCellToDatabase,
  AddDataToDatabase,
} from "../../services/ApiService";

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
  };
  if (stackholder.text !== "") {
    setColumns([...columns, stackholder]);

    // DATEN HIER SENDEN, bzw funktion aufrufen
    console.log(JSON.stringify(stackholder));

    AddDataToDatabase(stackholder, ClientTypes.Stakeholders, clientID);
    // Feth Data hier => mal gucken ob useeffect ausreicht.
    // fetchData("clientShakeholders", setColumns, 2, null);
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
  if (subgroup.text !== "") {
    setRows([...rows, subgroup]); // KANN man sich nach dem post sparen

    // DATEN HIER SENDEN, bzw funktion aufrufen
    console.log(JSON.stringify(subgroup));

    AddDataToDatabase(subgroup, ClientTypes.SubGroups, clientID, groupID);
  }
  // Fehlermeldung => gebe Text ein
};

export const AddCell = async (
  clientStakeholderId: number,
  clientSubGroupId: number,
  title: string,
  text: string,
  clientID: number,
  groupID: number,
  cell: Cell[],
  setCell: (cell: Cell[]) => void
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

  console.log(newCell);

  if (newCell.message.text !== "" || newCell.message.title !== "") {
    AddCellToDatabase(newCell, clientID, groupID);
  }
  setCell([...cell, newCell]);
};

export const UpdateSubGroup = async (
  id: number,
  title: string,
  description: string
) => {
  console.log("ferti");
};

export const handleCellClick = (rowId: number, columnId: number) => {
  const zelle = Zellen.find(
    (c) => c.clientStakeholderId === columnId && c.clientSubGroupId === rowId
  );

  if (zelle?.message.text) console.log("zelle: ", zelle.message.text);
  else console.log({ columnId }, { rowId });
};

//    <<<<<<<<<< =============== >>>>>>>>>>
//    <<<<<<<<<< =============== >>>>>>>>>>
//    <<<<<<<<<< =============== >>>>>>>>>>
// RELEVANT FÜR DELETE
// const newColumns = columns.filter(stackholder => stackholder.id !== stackholderId);
// setColumns(newColumns);
