import {
  Cell,
  Group,
  HttpAction,
  Stakeholder,
} from "../Models/data.interfaces";
import { useStore } from "../../store";
import { Classifications, Relevances } from "../../utils/constants";
import { useEffect, useState } from "react";
import styles from "./Matrix.module.scss"; // Import the updated CSS module
import useSubStakeholderData from "../Queries/useSubStakeholder";
import SelectDropdown from "../SelectDropdown/SelectDropdown"; // Unchanged
import RoundButton from "../RoundButton/RoundButton";
import {
  filteredStakeholderCount,
  handleRelevanceChange,
  handleSelectChange,
  onClickCell,
  onClickColumn,
  onClickRow,
  setFilterFunction,
} from "./MatrixFunctions";

interface Props {
  rows: Group[];
  columns: Stakeholder[];
  cells: Cell[];
  showAddToMatrix: boolean;
  setTitle: (name: string) => void;
  setDescription: (name: string) => void;
}

const Matrix = ({
  rows,
  columns,
  cells,
  showAddToMatrix,
  setTitle,
  setDescription,
}: Props) => {
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

  const { SubStakeholder, isLoadingStake } = useSubStakeholderData();

  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [selectedRelevance, setSelectedRelevance] = useState<number>(0);
  const [copyColumns, setCopyColumns] = useState<Stakeholder[]>(
    Array.isArray(columns) ? columns : []
  );

  if (isLoadingStake) <div>Loading...</div>;

  useEffect(() => {
    setCopyColumns(Array.isArray(columns) ? columns : []);
    setFilterFunction(
      selectedOption,
      selectedRelevance,
      setCopyColumns,
      columns
    );
  }, [columns, selectedRelevance, selectedOption]);

  useEffect(() => {
    SetDELETE(false);
  }, []);

  return (
    <section className={styles.heroContainer}>
      {/* STAKEHOLDER ART MENU */}
      <h1 className={styles.title}>Ermittlung relevanter Stakeholder</h1>
      <div className={styles.inputContainer}>
        <div className={styles.selectWrapper}>
          <label className={styles.label} htmlFor="stakeholderArt">
            Stakeholder filtern:
          </label>
          <SelectDropdown
            options={Classifications}
            value={selectedOption}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              handleSelectChange(event, setSelectedOption)
            }
            placeholder="Alle Stakeholder"
            style={{ width: "200px" }}
          />
          <SelectDropdown
            options={Relevances}
            value={selectedRelevance}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              handleRelevanceChange(event, setSelectedRelevance)
            }
            placeholder="Alle Relevanzen"
            style={{ width: "200px" }}
          />
        </div>
        <div className={styles.checkboxWrapper}>
          <label className={styles.label} htmlFor="setDELETE">
            Löschen aktivieren:
          </label>
          <input
            type="checkbox"
            id="setDELETE"
            name="setDELETE"
            onChange={(e) => SetDELETE(e.target.checked)}
            className={styles.checkbox} // Apply CSS module class
          />
        </div>
      </div>
      {/* ADD BUTTON CONTAINER */}
      {showAddToMatrix && (
        <div className={styles.btnGroup}>
          <button
            onClick={() => {
              setShowModal();
              setOnChangeSubGroup({ mode: HttpAction.POST, ID: 0 });
            }}
            className={styles.button} // Apply CSS module class
          >
            Thema hinzufügen
          </button>
          <button
            onClick={() => {
              setShowModal();
              setOnChangeStakeholder({ mode: HttpAction.POST, ID: 0 });
            }}
            className={styles.button} // Apply CSS module class
          >
            Stakeholdergruppe hinzufügen
          </button>
        </div>
      )}
      {/* TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stakeholderCount}>
                Anzahl hinterlegter Stakeholder:
              </th>
              {/* Display Columns */}
              {copyColumns &&
                copyColumns.length > 0 &&
                copyColumns.map((column: Stakeholder) => (
                  <th className={styles.columnHeader} key={column.id}>
                    <div
                      onClick={() => {
                        onClickColumn(
                          setDescription,
                          column,
                          setTitle,
                          setClassification,
                          setRelevance,
                          DELETE,
                          setOnChangeStakeholder,
                          setShowModal
                        );
                      }}
                      key={column.id}
                    >
                      {filteredStakeholderCount(column.id, SubStakeholder)}
                      <br />
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
            {/* Display Rows */}
            {rows &&
              rows.length > 0 &&
              Array.isArray(rows) &&
              rows.map((row: Stakeholder) => (
                <tr key={row.id}>
                  <td
                    key={row.id}
                    onClick={() => {
                      onClickRow(
                        setDescription,
                        row,
                        setTitle,
                        DELETE,
                        setOnChangeSubGroup,
                        setShowModal
                      );
                    }}
                    className={styles.rowTitle} // Apply CSS module class
                  >
                    {row.title}
                  </td>
                  {/* Display Cells */}
                  {copyColumns &&
                    copyColumns.length > 0 &&
                    copyColumns.map((column: Stakeholder) => (
                      <td
                        key={column.id + row.id}
                        onClick={() => {
                          console.log("hier");
                          onClickCell(
                            cells,
                            column,
                            row,
                            setCellID,
                            setShowModal,
                            setOnChangeCells,
                            setMessageValueByIndex,
                            DELETE
                          );
                        }}
                        className={styles.cell} // Apply CSS module class
                      >
                        {cells &&
                          cells.length > 0 &&
                          cells.find(
                            (c: Cell) =>
                              c.clientStakeholderId === column.id &&
                              c.clientGroupId === row.id &&
                              c.message.length > 0
                          )?.message?.length}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Matrix;
