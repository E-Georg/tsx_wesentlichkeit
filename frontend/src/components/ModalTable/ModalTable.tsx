import { useEffect, useRef, useState } from 'react';
import { Classifications, Relevances } from '../../utils/constants';
import { relevance } from '../../store';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import './ModalTable.scss'; // Import the SCSS file

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let value = Number(event?.target.value);
    value = value === 0 ? 5 : value;
    setClassification!!(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let value = Number(event.target.value);
    value = value === 0 ? 5 : value;
    setRelevance!!({ text: relevance?.text!!, value: value });
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRelevance!!({ text: event.target.value, value: relevance?.value!! });
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = description;
      setIsEditorReady(true);
    }
  }, [description]);

  return (
    <div className="modal-table-container">
      <input
        type="text"
        placeholder="Enter the Title of ..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="modal-table-input"
      />

      <div
        contentEditable
        ref={editorRef}
        id="editor"
        defaultValue={description}
        data-placeholder="Description"
        className="modal-table-editor"
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
            slice={true}
            defaultValue={5}
          />

          <textarea
            className="modal-table-textarea"
            placeholder="Begründen Sie die Relevanz!"
            value={relevance?.text}
            onChange={handleChangeInput}
            rows={1}
            cols={10}
          />
          <SelectDropdown
            options={Relevances}
            value={relevance?.value!!}
            onChange={handleChange}
            placeholder={'Relevanz auswählen'}
            slice={true}
            defaultValue={5}
          />
        </div>
      )}
    </div>
  );
};

export default ModalTable;
