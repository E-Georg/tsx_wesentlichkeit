import { SubGroup, Stackholder, Cell } from '../../utils/data.interfaces';
import { useStore } from '../../store';

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden
// React Query

interface Props {
  rows: SubGroup[];
  columns: Stackholder[];
  cells: Cell[];
  showAddToMatrix: boolean;
  setTitle: (name: string) => void;
  setText: (name: string) => void;
}

const Matrix = ({ rows, columns, cells, showAddToMatrix, setTitle, setText }: Props) => {
  const { setShowModal, setColumn, setRow, setCell, setOnUpdateRow, setOnUpdateColumn, cellID, setCellID } = useStore();

  return (
    <>
      {showAddToMatrix ? (
        <div>
          <button
            onClick={() => {
              setShowModal();
              setColumn();
            }}
          >
            Add Stackholder
          </button>

          <button
            onClick={() => {
              setShowModal();
              setRow();
            }}
          >
            Add SubGroup
          </button>
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
                  setOnUpdateColumn(true, column.id);
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
                  onClick={() => {
                    setCellID([row.id, column.id]);
                    if (
                      !cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)
                        ?.message.text
                    ) {
                      setShowModal();
                      setCell();
                      // setCellID([row.id, column.id]);
                    } // else update or delete
                    console.log(cellID);
                  }}
                >
                  {cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)
                    ?.message.text || ''}
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
