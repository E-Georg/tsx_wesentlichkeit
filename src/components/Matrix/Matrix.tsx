import { useState } from "react";
import { SubGroup, Stackholder, Cell } from "../../utils/data.interfaces";
import {
  AddCell,
  AddStackholder,
  AddSubGroup,
  DeleteStackholder,
  DeleteSubGroup,
  UpdateStackholder,
  UpdateSubGroup,
} from "./MatrixFunctions";
import Modal from "../Modal/Modal";

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden

interface Props {
  rows: SubGroup[];
  setRows: (row: SubGroup[]) => void;
  columns: Stackholder[];
  setColumns: (column: Stackholder[]) => void;
  cells: Cell[];
  setCells: (cell: Cell[]) => void;
  showAddToMatrix: boolean;
  title: string;
  text: string;
  setTitle: (name: string) => void;
  setText: (name: string) => void;
}

const Matrix = ({
  rows,
  setRows,
  columns,
  setColumns,
  cells,
  setCells,
  showAddToMatrix,
  title,
  text,
  setTitle,
  setText,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [stackholder, setStackholder] = useState(false);
  const [subGroup, setSubGroup] = useState(false);
  const [cell, setCell] = useState(false);
  const [cellID, setCellID] = useState<number[]>([0, 0]);
  const [onUpdate, setOnUpdate] = useState({
    show: false,
    clickedRowId: 0,
  });
  const [onStackholderDelete, setOnStackholderDelete] = useState({
    show: false,
    clickedStackholderId: 0,
  });

  const handleModalData = () => {
    if (stackholder) {
      AddStackholder(title, text, columns, setColumns, 2);
      setStackholder(false);
    } else if (subGroup) {
      AddSubGroup(title, text, rows, setRows, 2, 1);
      setSubGroup(false);
    } else if (cell) {
      AddCell(cellID[0], cellID[1], title, text, 2, 1, cells, setCells);
      setCell(false);
    } else if (onUpdate.show) {
      UpdateSubGroup(setRows, rows, onUpdate.clickedRowId, title, text, 2, 1);
      //DeleteSubGroup(setRows, rows, onUpdate.clickedRowId);
      setOnUpdate({ show: false, clickedRowId: 0 });
    } else if (onStackholderDelete.show) {
      UpdateStackholder(
        setColumns,
        columns,
        onStackholderDelete.clickedStackholderId,
        title,
        text,
        2,
        1
      );
      // DeleteStackholder(
      //   setColumns,
      //   columns,
      //   onStackholderDelete.clickedStackholderId
      // );
      setOnUpdate({ show: false, clickedRowId: 0 });
    }

    setShowModal(false);
    setTitle("");
    setText("");
  };

  return (
    <>
      {showAddToMatrix ? (
        <div>
          <button
            onClick={() => {
              setShowModal(true);
              setStackholder(true);
            }}
          >
            Add Stackholder
          </button>

          <button
            onClick={() => {
              setShowModal(true);
              setSubGroup(true);
            }}
          >
            Add SubGroup
          </button>

          <Modal
            title={title}
            text={text}
            setTitle={setTitle}
            setText={setText}
            handleData={handleModalData}
            showModal={showModal}
            handleClose={() => {
              setText("");
              setTitle("");
              setShowModal(false);
            }}
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
                onClick={() => {
                  setText(column.description);
                  setTitle(column.text);
                  setOnStackholderDelete({
                    show: true,
                    clickedStackholderId: column.id,
                  });
                  setShowModal(true);
                }}
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
                // Delete und Update
                // Update => id, oldTitle, odlDescription, new One in Modal
                // Delete => id
                onClick={() => {
                  setText(row.description);
                  setTitle(row.text);
                  setOnUpdate({
                    show: true,
                    clickedRowId: row.id,
                  });
                  setShowModal(true);
                }}
              >
                {row.text}
                {row.id}
              </td>
              {columns.map((column) => (
                <td
                  style={{ border: "1px solid red" }}
                  key={column.id + row.id}
                  // onClick={() => handleCellClick(row.id, column.id)}
                  onClick={() => {
                    if (
                      !cells.find(
                        (c: Cell) =>
                          c.clientStakeholderId === column.id &&
                          c.clientSubGroupId === row.id
                      )?.message.text
                    ) {
                      setShowModal(true);
                      setCell(true);
                      setCellID([row.id, column.id]);
                    } // else update or delete
                  }}
                >
                  {cells.find(
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
