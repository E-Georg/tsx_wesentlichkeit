import axios from 'axios';
import { useState } from 'react';

const FileUpload = () => {
  const [selectedFile] = useState<any>();
  const [selectedFileData, setSelectedFileData] = useState<any>();

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

        const res = await axios.post('https://example.com/api/upload', formData);
        console.log(res);
      }
    } catch (error: any) {
      console.error('Error sending data:', error.message);
    }
  };

  return (
    <>
      <div className="main-container">
        <div
          style={{
            display: 'flex',
            width: '10rem',
            height: '5rem',
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
    </>
  );
};

export default FileUpload;
