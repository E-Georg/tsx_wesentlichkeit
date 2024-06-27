import { useState } from "react";
import { SubGroup, Stackholder, Cell } from "../../utils/data.interfaces";
import {
  AddStackholder,
  AddSubGroup,
  handleCellClick,
} from "./MatrixFunctions";
import Modal from "../Modal/Modal";
import { Zellen } from "../../utils/data.api";

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden

interface Props {
  rows: SubGroup[];
  setRows: (row: SubGroup[]) => void;
  columns: Stackholder[];
  setColumns: (column: Stackholder[]) => void;
  cells: Cell[];
  showAddToMatrix: boolean;
  title: string;
  text: string;
  setTitle: (name: string) => void;
  setText: (name: string) => void;
  count: (number: number) => void;
}

const Matrix = ({
  rows,
  setRows,
  columns,
  setColumns,
  cells,
  showAddToMatrix,
  title,
  text,
  setTitle,
  setText,
  count,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [stackholder, setStackholder] = useState(false);
  const [subGroup, setSubGroup] = useState(false);

  return (
    <>
      {showAddToMatrix ? (
        <div>
          {/* <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          /> */}
          <button
            onClick={() => {
              setShowModal(true);
              setStackholder(true);
              // AddStackholder(inputValue, columns, setColumns, setInputValue);
            }}
          >
            Add Stackholder
          </button>

          <button
            onClick={() => {
              setShowModal(true);
              setSubGroup(true);
              // AddSubGroup(inputValue, rows, setRows, setInputValue);
            }}
          >
            Add SubGroup
          </button>

          <Modal
            title={title}
            text={text}
            setTitle={setTitle}
            setText={setText}
            handleData={() => {
              if (stackholder) {
                AddStackholder(text, columns, setColumns, setInputValue);
                setStackholder(false);
              } else if (subGroup) {
                AddSubGroup(text, rows, setRows, setInputValue);
                setSubGroup(false);
              }

              count(1);
              setShowModal(false);
              setTitle("");
              setText("");
            }}
            showModal={showModal}
            handleClose={() => setShowModal(false)}
          />
        </div>
      ) : (
        <></>
      )}
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((column) => (
              <th
                style={{ border: "1px solid green", fontSize: "1rem" }}
                key={column.id}
              >
                {column.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td
                style={{ border: "1px solid black", fontSize: "1rem" }}
                key={row.id}
              >
                {row.text}
              </td>
              {columns.map((column) => (
                <td
                  style={{ border: "1px solid red" }}
                  key={column.id + row.id}
                  onClick={() => handleCellClick(row.id, column.id)}
                >
                  {Zellen.find(
                    (c: Cell) =>
                      c.clientStakeholderId === column.id &&
                      c.clientSubGroupId === row.id
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
