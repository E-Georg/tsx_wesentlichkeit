import { useState, useRef, useEffect, Fragment } from "react";
import "./Modal.css";
import { useStore } from "../../store";
import { HttpAction } from "../Models/data.interfaces";
import useSubGroupData from "../Queries/useSubGroupData";
import useStakeholderData from "../Queries/useStakeholderData";
import useCellData from "../Queries/useCellData";
import Editor from "../Editor/Editor";
import { options } from "../../utils/constants";
import Dropdown from "../Dropdown/Dropdown";
import {
  CellFunction,
  StakeholderFunction,
  SubgroupFunction,
} from "./ModalFunction";

interface Props {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (text: string) => void;
}

const Modal = ({ title, description, setTitle, setDescription }: Props) => {
  const {
    showModal,
    cellID,
    reset,
    onChangeSubGroup,
    onChangeStakeholder,
    onChangeCells,
    classification,
    setClassification,
  } = useStore();

  const {
    addSubGroupMutation,
    deleteSubGroupMutation,
    updateSubGroupMutation,
  } = useSubGroupData();
  const {
    addStakeholderMutation,
    deleteStakeholderMutation,
    updateStakeholderMutation,
  } = useStakeholderData();
  const { deleteCellsMutation, updateCellsMutation, addCellsMutation } =
    useCellData();
  const [count, setCount] = useState<number>(1);

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = description; // Initialize editor content
      setIsEditorReady(true);
    }
  }, [description]);

  const handleModalData = async () => {
    console.log("in in ModalData");
    console.log(onChangeStakeholder.mode);
    console.log(onChangeSubGroup.mode);
    console.log(onChangeCells.mode);

    //===============================================================SUBGROUP===================================================================
    if (onChangeSubGroup.mode !== HttpAction.DEFAULT) {
      SubgroupFunction(
        deleteSubGroupMutation,
        updateSubGroupMutation,
        addSubGroupMutation,
        onChangeSubGroup,
        title,
        description
      );
    }
    //==========================================================STAKEHOLDER========================================================================
    if (onChangeStakeholder.mode !== HttpAction.DEFAULT) {
      StakeholderFunction(
        deleteStakeholderMutation,
        updateStakeholderMutation,
        addStakeholderMutation,
        onChangeStakeholder,
        title,
        description,
        classification
      );
    }

    // ============================================================CELLS============================================================================
    if (onChangeCells.mode !== HttpAction.DEFAULT) {
      CellFunction(
        deleteCellsMutation,
        updateCellsMutation,
        addCellsMutation,
        onChangeCells,
        title,
        description,
        cellID
      );
    }
    reset();
  };

  // Save Data with connection to stakeholder
  // Get Stakeholder from React Query
  // Get (SubStakeholderID, SubStakeholderName, stakeholderID)
  // Modal: Does the cell know the Stakeholder? => yes have id, compare id if true show, else not

  return (
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Modal-Title</h2>
          <img
            src="/src/assets/close.svg"
            alt="close"
            className="close"
            onClick={reset}
          />
        </div>

        {onChangeCells.mode !== HttpAction.DEFAULT &&
          [...Array(count)].map((_, index) => (
            <Fragment key={index}>
              {/* Modal-Menu */}
              <div className="modal-menu">
                <div className="menu-wrapper">
                  <button onClick={() => setCount(count + 1)}>Add</button>
                  <Dropdown stakeholderID={cellID.coolumnID} />
                </div>
                <div className="input-group">
                  <label htmlFor="cell">Cell Title:</label>
                  <input
                    id="cell"
                    type="text"
                    placeholder="Enter Cell Title..."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
              </div>

              {/* =====================================================================================EDITOR====================================================================================== */}
              {/* CKEditor */}

              {onChangeCells.mode !== HttpAction.DEFAULT ? <Editor /> : null}
            </Fragment>
          ))}

        {onChangeCells.mode === HttpAction.DEFAULT && (
          <div>
            <input
              type="text"
              placeholder="Enter the Title of ..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              style={{
                width: "100%",
                height: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                fontSize: "18px",
              }}
            />

            <div
              contentEditable
              ref={editorRef}
              id="editor"
              defaultValue={description}
              data-placeholder="Description"
              style={{
                width: "98.5%",
                height: "200px",
                border: "1px solid #ccc",
                padding: "0.5rem",
                marginBottom: "1rem",
                overflow: "auto",
                position: "relative",
                color: "black",
              }}
              onBlur={() =>
                isEditorReady &&
                editorRef.current &&
                setDescription(editorRef.current.innerHTML)
              }
            />
          </div>
        )}
        {onChangeStakeholder.mode != HttpAction.DEFAULT && (
          <select
            value={classification ?? ""}
            onChange={(e) =>
              setClassification(
                options.find((opt) => opt.value.toString() === e.target.value)
                  ?.value ?? 0
              )
            }
            style={{
              width: "100%",
              height: "2rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {classification === 0 ? (
              <option value={0}>Wähle die Stakeholder-Klassifizierung</option>
            ) : (
              <option value={classification}>
                {options[classification]?.label}
              </option>
            )}
            {options
              .filter((opt) => opt.value !== classification && opt.value !== 0) // Filter out "All"
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        )}

        {/* {onChangeCells.mode != HttpAction.DEFAULT ? <FileUpload /> : <></>} */}

        <button
          onClick={handleModalData}
          style={{ width: "100%", backgroundColor: "green", color: "white" }}
        >
          SAVE DATA
        </button>
      </div>
    </div>
  );
};

export default Modal;
