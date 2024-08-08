import { CKEditor } from '@ckeditor/ckeditor5-react';
import { editorConfig } from '../MessageCellComponent/MessageCellComponentFunctions';
import { ClassicEditor } from 'ckeditor5';
import { useStore } from '../../store';

const EditorComponent = ({ messageValue, index, text }: any) => {
  const { setMessageValueByIndex } = useStore();
  return (
    <>
      <CKEditor
        onChange={(_, editor) => {
          //   const newText = editor.getData();
          //   const existingMessageValue = messageValue[index];
          //   console.log(existingMessageValue);
          const newText = editor.getData();
          console.log(editor.getData());

          setMessageValueByIndex(index, {
            id: messageValue.id,
            text: newText,
            subStakeholderId: messageValue.subStakeholderId,
          });
        }}
        data={text}
        editor={ClassicEditor}
        config={editorConfig}
      />
    </>
  );
};

export default EditorComponent;
