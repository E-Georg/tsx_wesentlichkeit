import { Fragment } from 'react/jsx-runtime';
import { ChangeObject, messageValue, CellID } from '../../store';
import { HttpAction } from '../Models/data.interfaces';
import Dropdown from '../Dropdown/Dropdown';
import Editor from '../Editor/Editor';

type Props = {
  onChangeCells: ChangeObject;
  messageValue: messageValue[];
  cellID: CellID;
  setMessageValueByIndex: (index: number, obj: { title: string; text: string }) => void;
};

const ModalCells = ({ onChangeCells, messageValue, cellID, setMessageValueByIndex }: Props) => {
  return (
    <>
      {onChangeCells.mode !== HttpAction.DEFAULT &&
        [...Array(messageValue.length)].map((_, index) => (
          <Fragment key={index}>
            {/* Modal-Menu */}
            <div className="modal-menu">
              <div key={index} className="menu-wrapper">
                <Dropdown stakeholderID={cellID.coolumnID} />
              </div>
              <div className="input-group">
                <label htmlFor="cell">Cell Title:</label>
                <input
                  id="cell"
                  type="text"
                  placeholder="Enter Cell Title..."
                  value={messageValue[index].title}
                  onChange={(event) =>
                    setMessageValueByIndex(index, { title: event.target.value, text: messageValue[index].text })
                  }
                />
              </div>
            </div>

            {/* CKEditor */}
            <Editor
              text={messageValue[index].text}
              setMessageValueByIndex={setMessageValueByIndex}
              index={index}
              messageValue={messageValue[index]}
            />
          </Fragment>
        ))}

      {/* <FileUpload /> */}
    </>
  );
};

export default ModalCells;
