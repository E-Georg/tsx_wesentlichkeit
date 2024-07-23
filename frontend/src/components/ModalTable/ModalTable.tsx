import { useEffect, useRef, useState } from 'react';
import { Classifications, Relevances } from '../../utils/constants';
import { relevance } from '../../store';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  classification?: number;
  setClassification?: (num: number) => void;
  relevance?: relevance;
  setRelevance?: (data: relevance) => void;
};

const ModalTable = ({
  title,
  setTitle,
  description,
  setDescription,
  classification = undefined,
  setClassification = undefined,
  relevance = undefined,
  setRelevance = undefined,
}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleSelectChange = (event: any) => {
    let value = Number(event?.target.value);
    value = value === 0 ? 5 : value;
    console.log(value);
    // setClassification!!(Classifications.find((opt) => opt.value === value)?.value ?? 0);
    setClassification!!(value);
  };

  const handleChange = (event: any) => {
    let value = Number(event.target.value);
    console.log(value);
    value = value === 0 ? 5 : value;
    setRelevance!!({ text: relevance?.text!!, value: value });
  };

  const handleChangeInput = (event: any) => {
    setRelevance!!({ text: event.target.value, value: relevance?.value!! });
  };

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
          <SelectDropdown
            options={Classifications}
            value={classification}
            onChange={handleSelectChange}
            placeholder={'Wähle Stakeholderklassifizierung'}
            style={{
              width: '100%',
              height: '2rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
            slice={true}
            defaultValue={5}
          />

          <textarea
            style={{ width: '30rem', height: '4rem', marginRight: '2rem' }}
            placeholder="Begründen Sie die Bedeutsamkeit!"
            value={relevance?.text}
            onChange={handleChangeInput}
            rows={1}
            cols={10}
          />
          <SelectDropdown options={Relevances} value={relevance?.value!!} onChange={handleChange} placeholder={'Relevanz auswählen'} slice={true} defaultValue={5} />
        </div>
      )}
    </div>
  );
};

export default ModalTable;
