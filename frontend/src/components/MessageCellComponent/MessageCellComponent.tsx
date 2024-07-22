import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { editorConfig } from './configEditor';
import { messageValue } from '../../store';
import Dropdown from '../Dropdown/Dropdown';

type Props = {
  text: string;
  setMessageValueByIndex: (index: number, value: messageValue) => void;
  index: number;
  messageValue: messageValue;
  columnID: number;
};

const MessageCellComponent = ({ columnID, text, setMessageValueByIndex, index, messageValue }: Props) => {
  return (
    <>
      <div key={index} className="menu-wrapper">
        <Dropdown messageValue={messageValue} index={index} setMessageValueByIndex={setMessageValueByIndex} stakeholderID={columnID} />
      </div>
      <CKEditor
        onChange={(_, editor) => {
          setMessageValueByIndex(index, { title: messageValue.title, text: editor.getData(), subStakeholderId: messageValue.subStakeholderId });
        }}
        data={text}
        editor={ClassicEditor}
        config={editorConfig}
      />
    </>
  );
};

export default MessageCellComponent;
