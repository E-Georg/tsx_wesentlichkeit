import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  AccessibilityHelp,
  AutoLink,
  Autosave,
  Bold,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  ImageBlock,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  SimpleUploadAdapter,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Undo,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './Editor.css';
import axios from 'axios';
import { useEffect, useRef } from 'react';

const Editor = () => {
  // Text, Titel, usw.
  const [text, setText] = useState('<p>Welcome to E.Infra <3</p>');
  const [selectedFile] = useState<any>(); // , setSelectedFile] = useState<any>();
  const [selectedFileData, setSelectedFileData] = useState<any>();
  const [imageUrl] = useState<any>(''); // , setImageUrl] = useState<any>("");

  const handleFileChangeData = (event: any) => {
    const file = event.target.files[0];
    setSelectedFileData(file);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      if (selectedFileData) formData.append('fileData', selectedFileData);
      if (selectedFile) {
        // Prepare form data for file upload
        formData.append('file', selectedFile);

        // Make the HTTP request
        await axios.post('https://example.com/api/upload', formData);
        console.log('File successfully uploaded.');
      } else if (imageUrl.trim() !== '') {
        // HINZUFÜGEN DER DATEN
        await axios.post('https://example.com/api/upload', { imageUrl });
        console.log('Image URL successfully sent.');
      } else {
        console.log('Please choose a file or enter an image URL.');
      }
    } catch (error: any) {
      console.error('Error sending data:', error.message);
    }
  };

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig: any = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'findAndReplace',
        'selectAll',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'code',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'highlight',
        '|',
        'accessibilityHelp',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      AutoLink,
      Autosave,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      ImageBlock,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Italic,
      Link,
      Paragraph,
      PasteFromOffice,
      SelectAll,
      SimpleUploadAdapter,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Underline,
      Undo,
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        '|',
        'imageStyle:alignBlockLeft',
        'imageStyle:block',
        'imageStyle:alignBlockRight',
        '|',
        'resizeImage',
      ],
      styles: {
        options: ['alignBlockLeft', 'block', 'alignBlockRight'],
      },
    },
    initialData: '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
    },
    simpleUpload: {
      uploadUrl: `http://192.168.20.53/wa/api/clientStakeholderSignificance.php?param={%20%22action%22:%22i%22,%22clientId%22:2,%20%22clientSubGroupId%22:23,%20%22clientStakeholderId%22:38,%22title%22:"aa",%20%22text%22:"aa"}`,
      withCredentials: true,
    },
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem',
        }}
      >
        <div
          style={{
            padding: '0',
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <h4 style={{ padding: '0', margin: '0.1rem' }}>Titel</h4>
          <h6 style={{ padding: '0', margin: '0.1rem' }}>der Zelle mit der ID: 35.22:</h6>
          <input
            type="text"
            placeholder="Enter title"
            onChange={() => {
              //event) => {
              // const title = event.target.value;
            }}
          />
        </div>
      </div>
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor editor-container_include-style"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>{isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="main-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'unset',
              justifyContent: 'center',
            }}
          >
            <div>
              <h4>Upload a File</h4>
              <input type="file" onChange={handleFileChangeData} />
            </div>
          </div>
          <div style={{ padding: '2rem' }}>
            <button onClick={handleUpload}>Speichern</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
