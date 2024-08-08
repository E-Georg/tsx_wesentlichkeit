import { ChangeObject, messageValue, CellID, useStore } from '../../store';
import MessageCellComponent from '../MessageCellComponent/MessageCellComponent';
import { useEffect } from 'react';
import { Cell } from '../Models/data.interfaces';
import useCellData from '../Queries/useCellData';

type Props = {
  onChangeCells: ChangeObject;
  cellID: CellID;
};

const ModalCells = ({ cellID }: Props) => {
  const { setMessageValueByIndex } = useStore();
  const { Cells, isLoadingCells } = useCellData();
  if (isLoadingCells) {
    <div>...loading</div>;
  }

  const { messageValue } = useStore((state) => ({
    messageValue: state.messageValue,
  }));

  useEffect(() => {
    console.log('messageValue has changed:', messageValue);
  }, [messageValue]);

  useEffect(() => {
    if (Array.isArray(Cells) && cellID) {
      // Find the cell based on the IDs
      const foundCell = Cells.find(
        (c: Cell) => c.clientStakeholderId === cellID.coolumnID && c.clientGroupId === cellID.rowID
      );

      // Check if foundCell is defined and has a message property
      if (foundCell && Array.isArray(foundCell.message)) {
        // Iterate through messages and update state
        foundCell.message.forEach((message, index) => {
          setMessageValueByIndex(index, {
            id: message.id,
            text: message.text,
            subStakeholderId: message.subStakeholderId,
          });
        });
      }
    }
  }, [Cells, isLoadingCells, cellID]);

  return (
    <div
      style={{
        overflowY: 'scroll',
        maxHeight: '400px',
      }}
    >
      {/* onChangeCells.mode !== HttpAction.DEFAULT &&  */}
      {messageValue.map((_: messageValue, index: number) => (
        <div key={index}>
          {/* CKEditor  */}
          <MessageCellComponent
            columnID={cellID.coolumnID}
            text={messageValue[index].text}
            index={index}
            messageValueI={messageValue[index]}
          />
        </div>
      ))}

      {/* <FileUpload /> */}
    </div>
  );
};

export default ModalCells;
