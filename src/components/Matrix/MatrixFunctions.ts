import { Stackholder, SubGroup } from "../../utils/data.interfaces";
import { Zellen } from "../../utils/data.api";

export const AddStackholder = (
  inputValue: string,
  columns: Stackholder[],
  setColumns: (column: Stackholder[]) => void,
  setInputValue: (text: string) => void
) => {
  const inputText = inputValue;
  const stackholder: Stackholder = {
    id: columns.length + 1,
    name: inputText,
  };
  if (stackholder.name !== "") {
    setColumns([...columns, stackholder]);

    console.log(`Stackholder ID: ${stackholder.id}, Name: ${stackholder.name}`);
    setInputValue("");
  }
  // Fehlermeldung => gebe Text ein
};

export const AddSubGroup = (
  inputValue: string,
  rows: SubGroup[],
  setRows: (row: SubGroup[]) => void,
  setInputValue: (text: string) => void
) => {
  const inputText = inputValue;
  const subgroup: SubGroup = {
    id: rows.length + 1,
    name: inputText,
  };
  if (subgroup.name !== "") {
    setRows([...rows, subgroup]);

    console.log(`SubGroup ID: ${subgroup.id}, Name: ${subgroup.name}`);
    setInputValue("");
  }
  // Fehlermeldung => gebe Text ein
};

export const handleCellClick = (rowId: number, columnId: number) => {
  const zelle = Zellen.find(
    (c) => c.stackholderID === columnId && c.subGroupID === rowId
  );

  if (zelle) {
    console.log("zelle: ", zelle.message.text);
  } else {
    console.log("rowId: ", rowId);
    console.log("columnId: ", columnId);
  }
};
