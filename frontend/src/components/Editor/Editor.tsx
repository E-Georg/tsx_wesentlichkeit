import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./Editor.css";
import { useEffect } from "react";
import { useStore } from "../../store";
import { editorConfig } from "./configEditor";

const Editor = () => {
  const { description, setDescription } = useStore();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  return (
    <>
      {isLayoutReady && (
        <CKEditor
          onChange={(_, editor) => setDescription(editor.getData())}
          data={description}
          editor={ClassicEditor}
          config={editorConfig}
        />
      )}
    </>
  );
};

export default Editor;
