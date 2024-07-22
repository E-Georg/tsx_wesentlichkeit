import axios from 'axios';
import { useState } from 'react';

const FileUpload = () => {
  const [selectedFile] = useState<any>();
  const [selectedFileData, setSelectedFileData] = useState<any>();

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileData(e.target.files[0]);

      console.log(selectedFileData.name);
      console.log(selectedFileData.type);
      console.log((selectedFileData.size / 1024).toFixed(2));
    }
  };

  // Add to  Modal Button!
  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <>
      <div style={{ marginBottom: '2rem', marginLeft: '4rem', display: 'flex' }}>
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
            <h5>Upload a File</h5>
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
