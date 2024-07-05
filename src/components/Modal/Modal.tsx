import { useState, useRef, useEffect } from 'react';
import './modal.style.css';
import { useStore } from '../../store';
import {
  AddCell,
  AddStackholder,
  AddSubGroup,
  DeleteCell,
  DeleteStackholder,
  DeleteSubGroup,
  UpdateStackholder,
  UpdateSubGroup,
} from '../Matrix/MatrixFunctions';

interface Props {
  title: string;
  text: string;
  setTitle: (title: string) => void;
  setText: (text: string) => void;
}

const Modal = ({ title, text, setTitle, setText }: Props) => {
  const {
    rows,
    columns,
    cells,
    setRows,
    setColumns,
    setCells,
    showModal,
    column,
    setColumn,
    row,
    setRow,
    cell,
    setCell,
    onUpdateRow,
    setOnUpdateRow,
    onUpdateColumn,
    setOnUpdateColumn,
    cellID,
    reset,
  } = useStore();

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = text; // Initialize editor content
      setIsEditorReady(true);
    }
  }, [text]);

  const handleModalData = () => {
    console.log('in in ModalData');
    if (column) {
      AddStackholder(title, text, columns, setColumns, 2);
      setColumn();
    } else if (row) {
      AddSubGroup(title, text, rows, setRows, 2, 1);
      setRow();
    } else if (cell) {
      console.log('in Delte');
      // AddCell(cellID[0], cellID[1], title, text, 2, cells, setCells);
      DeleteCell(cellID[2] ? cellID[2] : 1, setCells, cells);
      setCell();
    } else if (onUpdateRow.show) {
      DeleteSubGroup(setRows, rows, onUpdateRow.clickedRowId);
      setOnUpdateRow(false, 0);
    } else if (onUpdateColumn.show) {
      DeleteStackholder(setColumns, columns, onUpdateColumn.clickedColId);
      setOnUpdateColumn(false, 0);
    }

    reset();
  };

  const handleFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);

    switch (command) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'insertList':
        document.execCommand(value || 'insertUnorderedList');
        break;
      case 'insertOrderedList':
        document.execCommand('insertOrderedList');
        break;
      case 'insertHorizontalLine':
        const hr = document.createElement('hr');
        range.insertNode(hr);
        break;
      default:
        break;
    }

    // Update state with new HTML content
    setText(editorRef.current.innerHTML);
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={reset}>
          &times;
        </span>
        <h2 style={{ textAlign: 'center' }}>Modal</h2>

        <input
          type="text"
          placeholder="Enter the Title of ..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        <div
          contentEditable
          ref={editorRef}
          id="editor"
          data-placeholder="I'm a placeholder"
          style={{
            width: '100%',
            height: '200px',
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '1rem',
            overflow: 'auto',
            position: 'relative',
          }}
          onBlur={() => isEditorReady && editorRef.current && setText(editorRef.current.innerHTML)}
        />

        <input
          type="text"
          placeholder="Enter the Description of ..."
          value={''}
          onChange={(event) => setText(event.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        {(column || onUpdateColumn.show) && (
          <input
            type="text"
            placeholder="Enter the Classification of ..."
            value={''}
            onChange={(event) => setText(event.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => handleFormat('bold')} style={{ width: '19%' }}>
            Bold
          </button>
          <button onClick={() => handleFormat('italic')} style={{ width: '19%' }}>
            Italic
          </button>
          <button onClick={() => handleFormat('underline')} style={{ width: '19%' }}>
            Underline
          </button>
          <button onClick={() => handleFormat('insertList')} style={{ width: '19%' }}>
            Bulleted List
          </button>
          <button onClick={() => handleFormat('insertOrderedList')} style={{ width: '19%' }}>
            Numbered List
          </button>
          <button onClick={() => handleFormat('insertHorizontalLine')} style={{ width: '19%' }}>
            Horizontal Line
          </button>
        </div>

        <button onClick={handleModalData} style={{ width: '100%' }}>
          Display Data
        </button>
      </div>
    </div>
  );
};

export default Modal;
