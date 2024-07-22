import { useEffect, useRef, useState } from 'react';
import { options, relevances } from '../../utils/constants';
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

  // const filteredOptions = options.filter((opt) => opt.value !== classification && opt.value !== 0);

  const handleSelectChange = (e: any) => {
    setClassification!!(options.find((opt) => opt.value.toString() === e.target.value)?.value ?? 0);
  };

  const handleChange = (event: any) => {
    setRelevance!!({ text: relevance?.text!!, value: Number(event.target.value) });
  };

  const handleInputChange = (event: any) => {
    const newText = event.target.value;
    setRelevance!!({ text: newText, value: relevance!!.value });
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
          {/* <select
            value={classification}
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
          </select> */}
          <SelectDropdown
            options={options}
            value={classification}
            onChange={handleSelectChange}
            placeholder={undefined}
            style={{
              width: '100%',
              height: '2rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          />

          <input style={{ width: '30rem', height: '2rem', marginRight: '2rem' }} placeholder="Why Prio or not" value={relevance?.text} onChange={handleInputChange} />
          {/* <select value={relevance?.value} onChange={handleChange} aria-placeholder={'Nulli'}>
            {prioritys.map((priority, index) => (
              <option key={index} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select> */}
          <SelectDropdown options={relevances} value={relevance!.value} onChange={handleChange} placeholder={undefined} />
        </div>
      )}
    </div>
  );
};

export default ModalTable;
