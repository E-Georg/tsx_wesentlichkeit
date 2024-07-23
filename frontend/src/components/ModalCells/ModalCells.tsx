import { Fragment } from 'react/jsx-runtime';
import { ChangeObject, messageValue, CellID } from '../../store';
import { HttpAction } from '../Models/data.interfaces';
import MessageCellComponent from '../MessageCellComponent/MessageCellComponent';

type Props = {
  onChangeCells: ChangeObject;
  messageValue: messageValue[];
  cellID: CellID;
  setMessageValueByIndex: (index: number, obj: messageValue) => void;
};

const ModalCells = ({ onChangeCells, messageValue, cellID, setMessageValueByIndex }: Props) => {
  return (
    <>
      {onChangeCells.mode !== HttpAction.DEFAULT &&
        // [...Array(messageValue.length)].map((_, index) => (
        messageValue.map((_, index) => (
          <Fragment key={index}>
            {/* CKEditor */}
            <MessageCellComponent
              columnID={cellID.coolumnID}
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
