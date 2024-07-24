import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { editorConfig } from './configEditor';
import { messageValue, useStore } from '../../store';
import Dropdown from '../Dropdown/Dropdown';
import useCellData from '../Queries/useCellData';
import TrashButton from '../TrashButton/TrashButton';

type Props = {
  text: string;
  setMessageValueByIndex: (index: number, value: messageValue) => void;
  index: number;
  messageValue: messageValue;
  columnID: number;
};

// TODO:
// 1. Get CellMessageId
// 2. How to Delete if Cell is empty? => DeleteMessageValueById => Add ID
// 3. Function in Backend to Delete CellMessage By ID

const MessageCellComponent = ({ columnID, text, setMessageValueByIndex, index, messageValue }: Props) => {
  const { deleteCellMutation } = useCellData();
  const { setDelteMessageValueByIndex } = useStore();

  // useEffect(() => {}, [deleteCellMutation]);

  const handleDelete = async (cellMessageId: number) => {
    if (cellMessageId.toString().length === 13) {
      setDelteMessageValueByIndex(cellMessageId);
      return;
    }

    const res = await deleteCellMutation(cellMessageId);
    console.log(res);
    if (res === 1) setDelteMessageValueByIndex(cellMessageId);
  };

  return (
    <>
      <div key={index} className="menu-wrapper">
        <TrashButton handleClick={() => handleDelete(messageValue.id)} />
        <Dropdown messageValue={messageValue} index={index} setMessageValueByIndex={setMessageValueByIndex} stakeholderID={columnID} />
      </div>
      <CKEditor
        onChange={(_, editor) => {
          setMessageValueByIndex(index, { id: messageValue.id, title: messageValue.title, text: editor.getData(), subStakeholderId: messageValue.subStakeholderId });
        }}
        data={text}
        editor={ClassicEditor}
        config={editorConfig}
      />
    </>
  );
};

export default MessageCellComponent;
