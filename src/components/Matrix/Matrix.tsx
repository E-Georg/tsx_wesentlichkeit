import { SubGroup, Stackholder, Cell } from '../../utils/data.interfaces';
import { AddCell, AddStackholder, AddSubGroup, DeleteStackholder, DeleteSubGroup, UpdateStackholder, UpdateSubGroup } from './MatrixFunctions';
import Modal from '../Modal/Modal';
import { useMatrixStore } from '../../store';

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden
// React Query

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

const Matrix = ({ rows, setRows, columns, setColumns, cells, setCells, showAddToMatrix, title, text, setTitle, setText }: Props) => {
  const { showModal, setShowModal, stackholder, setStackholder, subGroup, setSubGroup, cell, setCell, onUpdateRow, setOnUpdateRow, onUpdateStackholder, setOnUpdateStackholder, cellID, setCellID } =
    useMatrixStore();

  const handleModalData = () => {
    if (stackholder) {
      AddStackholder(title, text, columns, setColumns, 2);
      setStackholder();
    } else if (subGroup) {
      AddSubGroup(title, text, rows, setRows, 2, 1);
      setSubGroup();
    } else if (cell) {
      AddCell(cellID[0], cellID[1], title, text, 2, cells, setCells);
      setCell();
    } else if (onUpdateRow.show) {
      UpdateSubGroup(setRows, rows, onUpdateRow.clickedRowId, title, text, 2, 1);
      //DeleteSubGroup(setRows, rows, onUpdate.clickedRowId);
      setOnUpdateRow(false, 0);
    } else if (onUpdateStackholder.show) {
      UpdateStackholder(setColumns, columns, onUpdateStackholder.clickedColId, title, text, 2, 1);
      // DeleteStackholder(
      //   setColumns,
      //   columns,
      //   onStackholderDelete.clickedStackholderId
      // );
      setOnUpdateRow(false, 0);
    }

    setShowModal();
    setTitle('');
    setText('');
  };

  return (
    <>
      {showAddToMatrix ? (
        <div>
          <button
            onClick={() => {
              setShowModal();
              setStackholder();
            }}
          >
            Add Stackholder
          </button>

          <button
            onClick={() => {
              setShowModal();
              setSubGroup();
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
              setText('');
              setTitle('');
              setShowModal();
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
                  setOnUpdateStackholder(true, column.id);
                  setShowModal();
                }}
                style={{
                  border: '1px solid green',
                  fontSize: '1rem',
                }}
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
                style={{
                  border: '1px solid black',
                  fontSize: '1rem',
                }}
                key={row.id}
                // Delete und Update
                // Update => id, oldTitle, odlDescription, new One in Modal
                // Delete => id
                onClick={() => {
                  setText(row.description);
                  setTitle(row.text);
                  setOnUpdateRow(true, row.id);
                  setShowModal();
                }}
              >
                {row.text}
              </td>
              {columns.map((column) => (
                <td
                  style={{ border: '1px solid red' }}
                  key={column.id + row.id}
                  // onClick={() => handleCellClick(row.id, column.id)}
                  onClick={() => {
                    setCellID([row.id, column.id]);
                    if (!cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)?.message.text) {
                      setShowModal();
                      setCell();
                      // setCellID([row.id, column.id]);
                    } // else update or delete
                    console.log(cellID);
                  }}
                >
                  {cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)?.message.text || ''}
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
