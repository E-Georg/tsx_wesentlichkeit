import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './Editor.css';
import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { editorConfig } from './configEditor';

const Editor = () => {
  const { description, setDescription } = useStore();

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem',
      }}
    >
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor editor-container_include-style"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditor
                  onChange={(_, editor) => setDescription(editor.getData())}
                  data={description}
                  editor={ClassicEditor}
                  config={editorConfig}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Editor;
