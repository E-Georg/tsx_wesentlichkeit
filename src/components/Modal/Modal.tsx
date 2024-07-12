import { useState, useRef, useEffect, Fragment } from 'react';
import './modal.style.css';
import { useStore } from '../../store';

import { ClientTypes, HttpAction } from '../../utils/data.interfaces';
import useSubGroupData from '../Queries/useSubGroupData';
import useStackholderData from '../Queries/useStackholderData';
import useCellData from '../Queries/useCellData';
import Editor from '../Editor/Editor';
import { options } from '../../utils/constants';

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
    onChangeStackholder,
    onChangeCells,
    classification,
    setClassification,
  } = useStore();

  const { addSubGroupMutation, deleteSubGroupMutation, updateSubGroupMutation } = useSubGroupData();
  const { addStackholderMutation, deleteStackholderMutation, updateStackholderMutation } = useStackholderData();
  const { deleteCellsMutation, updateCellsMutation, addCellsMutation } = useCellData();
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
    console.log('in in ModalData');
    console.log(onChangeStackholder.mode);
    console.log(onChangeSubGroup.mode);
    console.log(onChangeCells.mode);

    //===============================================================SUBGROUP===================================================================
    if (onChangeSubGroup.mode !== HttpAction.DEFAULT) {
      // 3 Fälle

      // DELETE
      if (onChangeSubGroup.mode === HttpAction.DELETE) {
        await deleteSubGroupMutation({
          matrixObject: { id: onChangeSubGroup.ID, title: title, description: description },
          typeParameter: ClientTypes.SubGroups,
        });
        //
        // UPDATE
      } else if (onChangeSubGroup.mode === HttpAction.UPDATE)
        await updateSubGroupMutation({
          matrixObject: { id: onChangeSubGroup.ID, title: title, description: description },
          typeParameter: ClientTypes.SubGroups,
        });
      //
      // POST
      else if (onChangeSubGroup.mode === HttpAction.POST)
        await addSubGroupMutation({
          matrixObject: { id: onChangeSubGroup.ID, title: title, description: description },
          typeParameter: ClientTypes.SubGroups,
        });
    }
    //==========================================================STACKHOLDER========================================================================
    if (onChangeStackholder.mode !== HttpAction.DEFAULT) {
      // 3 Fälle
      //
      // DELETE
      if (onChangeStackholder.mode === HttpAction.DELETE)
        await deleteStackholderMutation({
          matrixObject: { id: onChangeStackholder.ID },
          typeParameter: ClientTypes.Stakeholders,
        });
      //
      // UPDATE
      else if (onChangeStackholder.mode === HttpAction.UPDATE)
        await updateStackholderMutation({
          matrixObject: {
            id: onChangeStackholder.ID,
            title: title,
            description: description,
            classification: classification,
          },
          typeParameter: ClientTypes.Stakeholders,
        });
      //
      // POST
      else if (onChangeStackholder.mode === HttpAction.POST)
        await addStackholderMutation({
          matrixObject: {
            id: onChangeStackholder.ID,
            title: title,
            description: description,
            classification: classification,
          },
          typeParameter: ClientTypes.Stakeholders,
        });
    }

    // ============================================================CELLS============================================================================
    if (onChangeCells.mode !== HttpAction.DEFAULT) {
      if (onChangeCells.mode === HttpAction.DELETE) {
        await deleteCellsMutation({ ID: cellID[2] });
      } else if (onChangeCells.mode === HttpAction.UPDATE) {
        await updateCellsMutation({ cell: { id: cellID[2], message: { title: title, description: description } } });
      } else if (onChangeCells.mode === HttpAction.POST) {
        await addCellsMutation({
          cell: {
            id: cellID[2],
            clientSubGroupId: cellID[0],
            clientStakeholderId: cellID[1],
            message: { title: title, description: description },
          },
        });
      }
    }
    reset();
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={reset}>
          &times;
        </span>
        <h2 style={{ textAlign: 'center' }}>Modal</h2>

        {onChangeCells.mode !== HttpAction.DEFAULT &&
          [...Array(count)].map((_, index) => (
            <Fragment key={index}>
              <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
                <button style={{ flex: 1, maxWidth: '4rem', marginRight: '5rem' }} onClick={() => setCount(count + 1)}>
                  Add
                </button>
                {/* <Dropdown /> */}
              </div>

              <input
                type="text"
                placeholder="Enter the Title of ..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                style={{ width: '100%', height: '2rem', marginBottom: '2rem', textAlign: 'center', fontSize: '18px' }}
              />
              {/* =====================================================================================EDITOR====================================================================================== */}

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
              style={{ width: '100%', height: '2rem', marginBottom: '2rem', textAlign: 'center', fontSize: '18px' }}
            />

            <div
              contentEditable
              ref={editorRef}
              id="editor"
              defaultValue={description}
              data-placeholder="Description"
              style={{
                width: '98.5%',
                height: '200px',
                border: '1px solid #ccc',
                padding: '0.5rem',
                marginBottom: '1rem',
                overflow: 'auto',
                position: 'relative',
                color: 'black',
              }}
              onBlur={() => isEditorReady && editorRef.current && setDescription(editorRef.current.innerHTML)}
            />
          </div>
        )}
        {onChangeStackholder.mode != HttpAction.DEFAULT && (
          <select
            value={classification!!}
            onChange={(e) =>
              setClassification(options.find((opt) => opt.value.toString() === e.target.value)?.value ?? 1)
            }
            style={{
              width: '100%',
              height: '2rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {classification === null ? (
              <option value={0}>Wähle die Stackholder-Klassifizierung</option>
            ) : (
              <option value={classification}>{options[classification]?.label}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* {onChangeCells.mode != HttpAction.DEFAULT ? <FileUpload /> : <></>} */}

        <button onClick={handleModalData} style={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
          SAVE DATA
        </button>
      </div>
    </div>
  );
};

export default Modal;
