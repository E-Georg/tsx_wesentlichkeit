import { Cell, HttpAction, Stakeholder, SubGroup, SubStakeholder } from '../Models/data.interfaces';
import { useStore } from '../../store';
import { Classifications, Relevances } from '../../utils/constants';
import { useEffect, useState } from 'react';
import './Martix.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import RoundButton from '../RoundButton/RoundButton';

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
    setMessageValueByIndex,
    setRelevance,
  } = useStore();

  const { SubStakeholder, isLoadingStack } = useSubStakeholderData();

  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [selectedRelevance, setSelectedRelevance] = useState<number>(0);
  const [copyColumns, setCopyColums] = useState<Stakeholder[]>(columns);

  if (isLoadingStack) <div> Loading...</div>;

  useEffect(() => {
    setCopyColums(columns);
    if (selectedOption !== 0) {
      if (selectedRelevance === 0) {
        setCopyColums(
          columns.filter((item: Stakeholder) => {
            if (item.classification === null) return false;
            return item.classification === selectedOption;
          })
        );
      } else {
        setCopyColums(
          columns.filter((item: Stakeholder) => {
            if (item.classification === null) return false;
            return item.classification === selectedOption && item.relevance === selectedRelevance;
          })
        );
      }
    } else {
      if (selectedRelevance != 0) {
        setCopyColums(
          columns.filter((item: Stakeholder) => {
            if (item.classification === null) return false;
            return item.relevance === selectedRelevance;
          })
        );
      }
    }
  }, [columns, selectedRelevance, selectedOption]);

  useEffect(() => {
    SetDELETE(false);
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let value = Number(event.target.value);
    setSelectedOption(value);
  };

  const handleRelevanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let value = Number(event.target.value);
    setSelectedRelevance(value);
  };

  return (
    <>
      <section className="hero-container">
        {/* STAKEHOLDER ART MENU */}
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>Ermittlung relevanter Stakeholder</h1>
        <div className="input-container">
          <div className="select-wrapper">
            <label className="label" htmlFor="stakeholderArt">
              Stakeholder filtern:
            </label>
            <SelectDropdown options={Classifications} value={selectedOption} onChange={handleSelectChange} placeholder="Alle Stakeholder" style={{ width: '200px' }} />
            <SelectDropdown options={Relevances} value={selectedRelevance} onChange={handleRelevanceChange} placeholder="Alle Relevanzen" style={{ width: '200px' }} />
          </div>
          <div className="checkbox-wrapper">
            <label className="label" htmlFor="setDELETE">
              Löschen aktivieren:
            </label>
            <input type="checkbox" id="setDELETE" name="setDELETE" onChange={(e) => SetDELETE(e.target.checked)} />
          </div>
        </div>
        {/* ADD BUTTON CONTAINER */}
        {showAddToMatrix ? (
          <div className="btn-group">
            <button
              onClick={() => {
                setShowModal();
                setOnChangeStakeholder({ mode: HttpAction.POST, ID: 0 });
              }}
            >
              Stakeholdergruppe hinzufügen
            </button>

            <button
              onClick={() => {
                setShowModal();
                setOnChangeSubGroup({ mode: HttpAction.POST, ID: 0 });
              }}
            >
              Thema hinzufügen
            </button>
          </div>
        ) : null}
        {/* TABELLE */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ verticalAlign: 'top' }}>Anzahl hinterlegter Stakeholder: </th>
                {columns &&
                  copyColumns.map((column: Stakeholder) => (
                    <th style={{ verticalAlign: 'bottom' }} key={column.id}>
                      <div
                        onClick={() => {
                          setDescription(column.description);
                          setTitle(column.title);
                          // console.log(column.classification);
                          setClassification(column.classification!!);
                          setRelevance({ text: column.relevanceText!!, value: column.relevance!! });
                          console.log({ text: column.relevanceText!!, value: column.relevance!! });
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
                        {SubStakeholder?.length!! >= 1 && SubStakeholder?.filter((option: SubStakeholder) => option.stakeholderId === column.id).length !== 0 && (
                          <>
                            {SubStakeholder?.length!! >= 1 && SubStakeholder?.filter((option: SubStakeholder) => option.stakeholderId === column.id).length}
                            <br />
                          </>
                        )}
                        {column.title}
                        <div>
                          <RoundButton relevance={column.relevance!!} />
                        </div>
                      </div>
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
                          const foundCell: Cell | undefined = cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id);
                          const idOfCell = foundCell === undefined ? 0 : foundCell.id;
                          setCellID({
                            rowID: row.id,
                            coolumnID: column.id,
                            cellID: idOfCell,
                          });
                          console.log({
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
                            // iterate and fill the whole object
                            foundCell.message.forEach((_, index: number) => {
                              setMessageValueByIndex(index, {
                                id: foundCell.message[index].id,
                                title: foundCell.message[index].title,
                                text: foundCell.message[index].text,
                                subStakeholderId: foundCell.message[index].subStakeholderId,
                              });
                            });
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
                        {cells && cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientSubGroupId === row.id && c.message.length > 0)?.message?.length}
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
