import { Cell, Stackholder, SubGroup } from "../../utils/data.interfaces";
import { Zellen } from "../../utils/data.api";
import { fetchData } from "../../services/ApiService";

export const AddStackholder = async (
  inputValue: string,
  columns: Stackholder[],
  setColumns: (column: Stackholder[]) => void,
  setInputValue: (text: string) => void
) => {
  const inputText = inputValue;
  const stackholder: Stackholder = {
    id: columns.length + 1,
    text: inputText,
  };
  if (stackholder.text !== "") {
    setColumns([...columns, stackholder]);

    // DATEN HIER SENDEN, bzw funktion aufrufen
    console.log(JSON.stringify(stackholder));
    // Feth Data hier => mal gucken ob useeffect ausreicht.
    // fetchData("clientShakeholders", setColumns, 2, null);
    setInputValue("");
  }
  // Fehlermeldung => gebe Text ein
};

export const AddSubGroup = async (
  inputValue: string,
  rows: SubGroup[],
  setRows: (row: SubGroup[]) => void,
  setInputValue: (text: string) => void
) => {
  const inputText = inputValue;
  const subgroup: SubGroup = {
    id: rows.length + 1,
    text: inputText,
  };
  if (subgroup.text !== "") {
    setRows([...rows, subgroup]);

    // DATEN HIER SENDEN, bzw funktion aufrufen
    console.log(JSON.stringify(subgroup));
    setInputValue("");
  }
  // Fehlermeldung => gebe Text ein
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
