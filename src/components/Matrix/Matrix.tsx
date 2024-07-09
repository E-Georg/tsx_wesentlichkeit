import { Cell, HttpAction } from '../../utils/data.interfaces';
import { useStore } from '../../store';

// Wie kann ich den Datanbank aufruf so schaffen, dass die Rows aktualisert werden
// React Query

interface Props {
  rows: any; //SubGroup[];
  columns: any; //Stackholder[];
  cells: any; //Cell[];
  showAddToMatrix: boolean;
  setTitle: (name: string) => void;
  setText: (name: string) => void;
}

const Matrix = ({ rows, columns, cells, showAddToMatrix, setTitle, setText }: Props) => {
  const { setShowModal, cellID, setCellID, setOnChangeSubGroup, setOnChangeStackholder, setOnChangeCells } = useStore();

  return (
    <>
      {showAddToMatrix ? (
        <div>
          <button
            onClick={() => {
              setShowModal();
              setOnChangeStackholder(HttpAction.POST, 0);
              //setColumn();
            }}
          >
            Add Stackholder
          </button>

          <button
            onClick={() => {
              setShowModal();
              setOnChangeSubGroup(HttpAction.POST, 0);
              // setRow();
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
            {columns &&
              columns.map((column: any) => (
                <th
                  onClick={() => {
                    setText(column.description);
                    setTitle(column.text);
                    setOnChangeStackholder(HttpAction.UPDATE, column.id);
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
          {rows.map((row: any) => (
            <tr key={row.id}>
              <td
                style={{
                  border: '1px solid black',
                  fontSize: '1rem',
                }}
                key={row.id}
                onClick={() => {
                  setText(row.description);
                  setTitle(row.text);
                  setOnChangeSubGroup(HttpAction.DELETE, row.id);
                  setShowModal();
                }}
              >
                {row.text}
              </td>
              {columns &&
                columns.map((column: any) => (
                  <td
                    style={{ border: '1px solid red' }}
                    key={column.id + row.id}
                    onClick={() => {
                      const foundCell: Cell | undefined = cells.find(
                        (c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id
                      );
                      const idOfCell = foundCell === undefined ? 0 : foundCell.id;
                      setCellID([row.id, column.id, idOfCell]);

                      if (!foundCell) {
                        setShowModal();
                        setOnChangeCells(HttpAction.POST, idOfCell);
                      } else {
                        setTitle(foundCell.message.title);
                        setText(foundCell.message.text);
                        setShowModal();
                        setOnChangeCells(HttpAction.UPDATE, idOfCell);
                      }
                      console.log(cellID);
                    }}
                  >
                    {(cells &&
                      cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)
                        ?.message.title) ||
                      ''}
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
