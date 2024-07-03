import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Autosave,
  Bold,
  Essentials,
  ImageBlock,
  ImageInsert,
  ImageInsertViaUrl,
  ImageToolbar,
  ImageUpload,
  Italic,
  Paragraph,
  SelectAll,
  SimpleUploadAdapter,
  Undo,
  ImageResizeEditing,
  ImageResizeHandles,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./Editor.css";
import axios from "axios";

const Editor = () => {
  const [text, setText] = useState("<p>Welcome to E.Infra <3</p>");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [selectedFileData, setSelectedFileData] = useState<any>();
  const [imageUrl, setImageUrl] = useState<any>("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImageUrl(null);
  };

  const handleFileChangeData = (event: any) => {
    const file = event.target.files[0];
    setSelectedFileData(file);
  };

  const handleImageUrlChange = (event: any) => {
    setImageUrl(event.target.value);
    setSelectedFile(null); // Clear selectedFile when an image URL is provided
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      if (selectedFileData) formData.append("fileData", selectedFileData);
      if (selectedFile) {
        // Prepare form data for file upload
        formData.append("file", selectedFile);

        // Make the HTTP request
        await axios.post("https://example.com/api/upload", formData);
        console.log("File successfully uploaded.");
      } else if (imageUrl.trim() !== "") {
        // HINZUFÜGEN DER DATEN
        await axios.post("https://example.com/api/upload", { imageUrl });
        console.log("Image URL successfully sent.");
      } else {
        console.log("Please choose a file or enter an image URL.");
      }
    } catch (error: any) {
      console.error("Error sending data:", error.message);
    }
  };
  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "selectAll",
        "|",
        "bold",
        "italic",
        "|",
        "insertImage",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Autosave,
      Bold,
      Essentials,
      ImageBlock,
      ImageInsert,
      ImageInsertViaUrl,
      ImageToolbar,
      ImageUpload,
      ImageResizeEditing,
      ImageResizeHandles,
      Italic,
      Paragraph,
      SelectAll,
      SimpleUploadAdapter,
      Undo,
    ],
    image: {
      toolbar: [
        "imageTextAlternative",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "resizeImage:custom",
      ],
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:custom",
          value: "custom",
          icon: "custom",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
    },
    simpleUpload: {
      uploadUrl: `http://192.168.20.53/wa/api/clientStakeholderSignificance.php?param={%20%22action%22:%22i%22,%22clientId%22:2,%20%22clientSubGroupId%22:23,%20%22clientStakeholderId%22:38,%22title%22:"aa",%20%22text%22:"aa"}`,
      withCredentials: true,
    },
  };
  return (
    <div>
      <div className="main-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "1rem",
          }}
        >
          <div
            style={{
              padding: "0",
              margin: "0",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <h4 style={{ padding: "0", margin: "0.1rem" }}>Titel</h4>
            <h6 style={{ padding: "0", margin: "0.1rem" }}>
              der Zelle mit der ID: 35.22:
            </h6>
            <input
              type="text"
              placeholder="Enter title"
              onChange={(event) => {
                const title = event.target.value;
              }}
            />
          </div>
        </div>

        <div className="editor-container editor-container_classic-editor">
          <div className="editor-container__editor">
            <CKEditor
              data={text}
              onChange={(_event, editor) => {
                setText(editor.getData());
              }}
              editor={ClassicEditor}
              config={editorConfig}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "unset",
            justifyContent: "center",
          }}
        >
          <div>
            <h4>Upload a File</h4>
            <input
              type="file"
              onChange={handleFileChangeData}
            />
          </div>

          {/* <div>
            <h5>Upload an Image</h5>
            <input
              type="file"
              onChange={handleFileChange}
            />
            <br />
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
            <br />
            {selectedFile && !imageUrl && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Uploaded Image"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            )}
            {imageUrl && !selectedFile && (
              <img
                src={imageUrl}
                alt="Image from URL"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            )}
          </div> */}
        </div>
        <div style={{ padding: "2rem" }}>
          <button onClick={handleUpload}>Upload and Save</button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
