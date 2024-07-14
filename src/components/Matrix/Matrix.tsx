import { Cell, HttpAction, Stakeholder, SubGroup } from '../../utils/data.interfaces';
import { useStore } from '../../store';

interface Props {
  rows: SubGroup[];
  columns: Stakeholder[];
  cells: Cell[];
  showAddToMatrix: boolean;
  setTitle: (name: string) => void;
  setDescription: (name: string) => void;
}

const Matrix = ({ rows, columns, cells, showAddToMatrix, setTitle, setDescription }: Props) => {
  const {
    setShowModal,
    cellID,
    setCellID,
    setOnChangeSubGroup,
    setOnChangeStakeholder,
    setOnChangeCells,
    setClassification,
    DELETE,
    SetDELETE,
  } = useStore();

  return (
    <>
      <div>
        <input type="checkbox" id="setDELETE" name="setDELETE" onChange={() => SetDELETE()} />
        <label htmlFor="setDELETE">Löschen aktivieren</label>
      </div>

      {showAddToMatrix ? (
        <div>
          <button
            onClick={() => {
              setShowModal();
              setOnChangeStakeholder(HttpAction.POST, 0);
            }}
          >
            Add Stakeholder
          </button>

          <button
            onClick={() => {
              setShowModal();
              setOnChangeSubGroup(HttpAction.POST, 0);
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
                    setDescription(column.description);
                    setTitle(column.text);
                    setClassification(column.classification);
                    // TEMPORÄR
                    if (DELETE) setOnChangeStakeholder(HttpAction.DELETE, column.id);
                    else setOnChangeStakeholder(HttpAction.UPDATE, column.id);
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
                  setDescription(row.description);
                  setTitle(row.text);
                  // TEMPORÄR
                  if (DELETE) setOnChangeSubGroup(HttpAction.DELETE, row.id);
                  else setOnChangeSubGroup(HttpAction.UPDATE, row.id);
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
                        console.log(foundCell);
                        setTitle(foundCell.message.title);
                        setDescription(foundCell.message.text);
                        setClassification(column.classification);
                        setShowModal();
                        // TEMPORÄR
                        if (DELETE) setOnChangeCells(HttpAction.DELETE, idOfCell);
                        else setOnChangeCells(HttpAction.UPDATE, idOfCell);
                      }
                      console.log(cellID);
                    }}
                  >
                    {(cells &&
                      cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)
                        ?.message.title.length) ||
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
