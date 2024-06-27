import { useState } from "react";
import { SubGroup, Stackholder, Cell } from "../../utils/data.interfaces";
import { AddStackholder, AddSubGroup, handleCellClick } from "./MatrixFunctions";


// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden

interface props {
  rows: SubGroup[];
  setRows: (row: SubGroup[]) => void;
  columns: Stackholder[];
  setColumns: (column: Stackholder[]) => void;
  cells: Cell[];
}

const Matrix = ({ rows, setRows, columns, setColumns, cells }: props) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
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
                  {cells.find(
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
