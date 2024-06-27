import { useState } from "react";
import {
  Stackholder,
  SubGroup,
  Zellen,
  initialColumns,
  initialRows,
} from "../../utils/InterfacesData";
import {
  AddStackholder,
  AddSubGroup,
  handleCellClick,
} from "./MatrixFunctions";

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden

const Matrix = () => {
  const [rows, setRows] = useState<SubGroup[]>(initialRows);
  const [columns, setColumns] = useState<Stackholder[]>(initialColumns);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button
          onClick={() =>
            AddStackholder(inputValue, columns, setColumns, setInputValue)
          }
        >
          Add Stackholder
        </button>
        <button
          onClick={() => AddSubGroup(inputValue, rows, setRows, setInputValue)}
        >
          Add SubGroup
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((column) => (
              <th style={{ border: "1px solid green" }} key={column.id}>
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ border: "1px solid black" }} key={row.id}>
                {row.name}
              </td>
              {columns.map((column) => (
                <td
                  style={{ border: "1px solid red" }}
                  key={column.id + row.id}
                  onClick={() => handleCellClick(row.id, column.id)}
                >
                  {Zellen.find(
                    (c) =>
                      c.stackholderID === column.id && c.subGroupID === row.id
                  )?.message.text || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Matrix;
