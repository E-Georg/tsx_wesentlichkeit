import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { editorConfig, handleDelete } from './MessageCellComponentFunctions';
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

const MessageCellComponent = ({ columnID, text, setMessageValueByIndex, index, messageValue }: Props) => {
  const { deleteCellMutation } = useCellData();
  const { setDelteMessageValueByIndex } = useStore();

  return (
    <>
      <div key={index} className="menu-wrapper">
        <TrashButton handleClick={() => handleDelete(messageValue.id, setDelteMessageValueByIndex, deleteCellMutation)} />
        {/* SubStakeholder-Dropdown */}
        <Dropdown messageValue={messageValue} index={index} setMessageValueByIndex={setMessageValueByIndex} stakeholderID={columnID} />
      </div>
      <CKEditor
        onChange={(_, editor) => {
          setMessageValueByIndex(index, { id: messageValue.id, text: editor.getData(), subStakeholderId: messageValue.subStakeholderId });
        }}
        data={text}
        editor={ClassicEditor}
        config={editorConfig}
      />
    </>
  );
};

export default MessageCellComponent;
