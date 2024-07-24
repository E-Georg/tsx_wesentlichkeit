import { Fragment } from 'react/jsx-runtime';
import { ChangeObject, messageValue, CellID, useStore } from '../../store';
import MessageCellComponent from '../MessageCellComponent/MessageCellComponent';
import { useMemo } from 'react';

type Props = {
  onChangeCells: ChangeObject;
  // messageValue: messageValue[];
  cellID: CellID;
  setMessageValueByIndex: (index: number, obj: messageValue) => void;
};

const ModalCells = ({ cellID, setMessageValueByIndex }: Props) => {
  const { messageValue } = useStore();
  useMemo(() => messageValue, [messageValue]);

  return (
    <>
      {/* {onChangeCells.mode !== HttpAction.DEFAULT && */}
      {messageValue.map((_: any, index: number) => (
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
