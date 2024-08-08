import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { editorConfig, handleDelete } from './MessageCellComponentFunctions';
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
      {/* <CKEditor
        onChange={(_, editor) => {
          const newText = editor.getData();
          const existingMessageValue = messageValue[index];
          console.log(existingMessageValue);

          setMessageValueByIndex(index, {
            id: existingMessageValue.id,
            text: newText,
            subStakeholderId: existingMessageValue.subStakeholderId,
          });
        }}
        data={text}
        editor={ClassicEditor}
        config={editorConfig}
      /> */}

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
