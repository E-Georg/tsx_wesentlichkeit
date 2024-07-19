import { useEffect, useRef, useState } from 'react';
import { options } from '../../utils/constants';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  classification?: number;
  setClassification?: (num: number) => void;
};

const ModalTable = ({ title, setTitle, description, setDescription, classification = undefined, setClassification = undefined }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = description;
      setIsEditorReady(true);
    }
  }, [description]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter the Title of ..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        style={{
          width: '100%',
          height: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '18px',
        }}
      />

      <div
        contentEditable
        ref={editorRef}
        id="editor"
        defaultValue={description}
        data-placeholder="Description"
        style={{
          width: '98.5%',
          height: '200px',
          border: '1px solid #ccc',
          padding: '0.5rem',
          marginBottom: '1rem',
          overflow: 'auto',
          position: 'relative',
          color: 'black',
        }}
        onBlur={() => {
          isEditorReady && editorRef.current && setDescription(editorRef.current.innerHTML);
        }}
      />

      {classification != undefined && setClassification != undefined && (
        <div>
          <select
            value={classification ?? ''}
            onChange={(e) => setClassification(options.find((opt) => opt.value.toString() === e.target.value)?.value ?? 0)}
            style={{
              width: '100%',
              height: '2rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {classification === 0 ? (
              <option value={0}>Wähle die Stakeholder-Klassifizierung</option>
            ) : (
              <option value={classification}>{options[classification]?.label}</option>
            )}
            {options
              .filter((opt) => opt.value !== classification && opt.value !== 0)
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ModalTable;
