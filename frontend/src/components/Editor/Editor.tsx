import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './Editor.css';
import { useEffect } from 'react';
import { editorConfig } from './configEditor';
import { messageValue } from '../../store';

type Props = {
  text: string;
  setMessageValueByIndex: (index: number, value: messageValue) => void;
  index: number;
  messageValue: messageValue;
};

const Editor = ({ text, setMessageValueByIndex, index, messageValue }: Props) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  return (
    <>
      {isLayoutReady && (
        <CKEditor
          onChange={(_, editor) => setMessageValueByIndex(index, { title: messageValue.title, text: editor.getData() })}
          data={text}
          editor={ClassicEditor}
          config={editorConfig}
        />
      )}
    </>
  );
};

export default Editor;
