import { Cell, HttpAction, Stakeholder, SubGroup } from '../Models/data.interfaces';
import { useStore } from '../../store';
import { options } from '../../utils/constants';
import { useEffect, useState } from 'react';
import './Martix.css';

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
    setCellID,
    setOnChangeSubGroup,
    setOnChangeStakeholder,
    setOnChangeCells,
    setClassification,
    DELETE,
    SetDELETE,
  } = useStore();
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [copyColumns, setCopyColums] = useState<Stakeholder[]>(columns);

  useEffect(() => {
    setCopyColums(columns);
    if (selectedOption != 0) {
      setCopyColums(
        columns.filter((item: Stakeholder) => {
          if (item.classification === null) return;
          return item.classification === selectedOption;
        })
      );
    }
  }, [columns]);

  // TODO:
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setSelectedOption(value);

    if (value === 0) {
      setCopyColums(columns);
    } else {
      setCopyColums(
        columns.filter((item: Stakeholder) => {
          if (item.classification === null) return;
          return item.classification === value;
        })
      );
    }
  };
  return (
    <>
      <section className="hero-container">
        {/* STAKEHOLDER PRIO MENU */}
        <div className="input-container">
          <div className="select-wrapper">
            <label className="label" htmlFor="stakeholderArt">
              Stakeholder Art auswählen:
            </label>
            <select id="stakeholderArt" value={selectedOption} onChange={handleSelectChange}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="checkbox-wrapper">
            <label className="label" htmlFor="setDELETE">
              Löschen aktivieren:
            </label>
            <input type="checkbox" id="setDELETE" name="setDELETE" onChange={() => SetDELETE()} />
          </div>
        </div>
        {/* ADD BUTTON CONTAINER */}
        {showAddToMatrix ? (
          <div className="btn_group">
            <button
              onClick={() => {
                setShowModal();
                setOnChangeStakeholder({ mode: HttpAction.POST, ID: 0 });
              }}
            >
              Add Stakeholder
            </button>

            <button
              onClick={() => {
                setShowModal();
                setOnChangeSubGroup({ mode: HttpAction.POST, ID: 0 });
              }}
            >
              Add SubGroup
            </button>
          </div>
        ) : (
          <></>
        )}
        {/* TABELLE */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                {columns &&
                  copyColumns.map((column: Stakeholder) => (
                    <th
                      onClick={() => {
                        setDescription(column.description);
                        setTitle(column.title);
                        setClassification(column.classification!!);
                        // TEMPORÄR
                        if (DELETE)
                          setOnChangeStakeholder({
                            mode: HttpAction.DELETE,
                            ID: column.id,
                          });
                        else
                          setOnChangeStakeholder({
                            mode: HttpAction.UPDATE,
                            ID: column.id,
                          });
                        setShowModal();
                      }}
                      key={column.id}
                    >
                      {column.title}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: Stakeholder) => (
                <tr key={row.id}>
                  <td
                    key={row.id}
                    onClick={() => {
                      setDescription(row.description);
                      setTitle(row.title);
                      // TEMPORÄR
                      if (DELETE)
                        setOnChangeSubGroup({
                          mode: HttpAction.DELETE,
                          ID: row.id,
                        });
                      else
                        setOnChangeSubGroup({
                          mode: HttpAction.UPDATE,
                          ID: row.id,
                        });
                      setShowModal();
                    }}
                  >
                    {row.title}
                  </td>
                  {columns &&
                    copyColumns.map((column: Stakeholder) => (
                      <td
                        key={column.id + row.id}
                        onClick={() => {
                          const foundCell: Cell | undefined = cells.find(
                            (c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id
                          );
                          const idOfCell = foundCell === undefined ? 0 : foundCell.id;
                          setCellID({
                            rowID: row.id,
                            coolumnID: column.id,
                            cellID: idOfCell,
                          });

                          if (!foundCell) {
                            setShowModal();
                            setOnChangeCells({
                              mode: HttpAction.POST,
                              ID: idOfCell,
                            });
                          } else {
                            setTitle(foundCell.message.title);
                            setDescription(foundCell.message.text);
                            setClassification(column.classification!!);
                            setShowModal();
                            // TEMPORÄR
                            if (DELETE)
                              setOnChangeCells({
                                mode: HttpAction.DELETE,
                                ID: idOfCell,
                              });
                            else
                              setOnChangeCells({
                                mode: HttpAction.UPDATE,
                                ID: idOfCell,
                              });
                          }
                        }}
                      >
                        {cells &&
                          cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id)
                            ?.message.title.length}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Matrix;
