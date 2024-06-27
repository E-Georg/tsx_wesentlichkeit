import { Stackholder, SubGroup, Zellen } from "../../utils/InterfacesData";

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
  console.log(
    Zellen.find((c) => c.stackholderID === columnId && c.subGroupID === rowId)
      ?.message.text || { rowId },
    { columnId }
  );
};
