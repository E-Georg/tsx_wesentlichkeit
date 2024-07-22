import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './MessageCellComponent.css';
import { useEffect } from 'react';
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
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  return (
    <>
      <div key={index} className="menu-wrapper">
        <Dropdown messageValue={messageValue} index={index} setMessageValueByIndex={setMessageValueByIndex} stakeholderID={columnID} />
      </div>
      {isLayoutReady && (
        <CKEditor
          onChange={(_, editor) => {
            setMessageValueByIndex(index, { title: messageValue.title, text: editor.getData(), subStakeholderId: messageValue.subStakeholderId });
          }}
          data={text}
          editor={ClassicEditor}
          config={editorConfig}
        />
      )}
    </>
  );
};

export default MessageCellComponent;
