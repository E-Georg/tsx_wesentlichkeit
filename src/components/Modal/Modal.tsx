// MyModal.tsx
import './modal.style.css';
import { useStore } from '../../store';
import {
  AddCell,
  AddStackholder,
  AddSubGroup,
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

  const handleModalData = () => {
    if (column) {
      AddStackholder(title, text, columns, setColumns, 2);
      setColumn();
    } else if (row) {
      AddSubGroup(title, text, rows, setRows, 2, 1);
      setRow();
    } else if (cell) {
      AddCell(cellID[0], cellID[1], title, text, 2, cells, setCells);
      setCell();
    } else if (onUpdateRow.show) {
      //UpdateSubGroup(setRows, rows, onUpdateRow.clickedRowId, title, text, 2, 1);
      DeleteSubGroup(setRows, rows, onUpdateRow.clickedRowId);
      setOnUpdateRow(false, 0);
    } else if (onUpdateColumn.show) {
      //UpdateStackholder(setColumns, columns, onUpdateColumn.clickedColId, title, text, 2, 1);
      DeleteStackholder(setColumns, columns, onUpdateColumn.clickedColId);
      setOnUpdateColumn(false, 0);
    }

    reset();
  };

  return (
    <>
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={reset}>
            &times;
          </span>
          <h2>Modal</h2>
          <input
            type="text"
            placeholder="Enter the Title of ..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="text"
            placeholder="Enter the Text of ..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <input
            type="text"
            placeholder="Enter the Description of ..."
            value={''}
            onChange={() => 'setText(event.target.value)'}
          />

          {(column || onUpdateColumn.show) && (
            <input
              type="text"
              placeholder="Enter the Classification of ..."
              value={''}
              onChange={() => 'setText(event.target.value)'}
            />
          )}

          <button onClick={handleModalData}>Display Data</button>
        </div>
      </div>
    </>
  );
};

export default Modal;
