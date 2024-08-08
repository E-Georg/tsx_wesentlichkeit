import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { handleDelete } from './MessageCellComponentFunctions';
import { messageValue, useStore } from '../../store';
import Dropdown from '../Dropdown/Dropdown';
import useCellData from '../Queries/useCellData';
import TrashButton from '../TrashButton/TrashButton';
import EditorComponent from '../EditorComponent/EditorComponent';

type Props = {
  text: string;
  index: number;
  messageValueI: messageValue;
  columnID: number;
};

const MessageCellComponent = ({ columnID, text, index, messageValueI }: Props) => {
  const { deleteCellMutation } = useCellData();
  const { setDelteMessageValueByIndex, setMessageValueByIndex, messageValue } = useStore();

  return (
    <>
      <div key={index} className="menu-wrapper">
        <TrashButton
          handleClick={() => handleDelete(messageValueI.id, setDelteMessageValueByIndex, deleteCellMutation)}
        />
        {/* SubStakeholder-Dropdown */}
        <Dropdown
          messageValue={messageValueI}
          index={index}
          setMessageValueByIndex={setMessageValueByIndex}
          stakeholderID={columnID}
        />
      </div>

      <EditorComponent
        setMessageValueByIndex={setDelteMessageValueByIndex}
        messageValue={messageValue}
        index={index}
        text={text}
      />
    </>
  );
};

export default MessageCellComponent;
