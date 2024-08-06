import React, { useState } from 'react';
import { useStore } from '../../store';
import styles from './PrevaluationModal.module.css'; // Corrected import

type Props = {
  setModalVisible: (visible: boolean) => void;
};

const PrevaluationModal = ({ setModalVisible }: Props) => {
  const { prevaluationTexts, setPrevaluationTextsArray, deleteprevaluationTextById } = useStore();

  const [inputFields, setInputFields] = useState([{ id: Date.now(), text: '' }]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const values = [...inputFields];
    values[index].text = event.target.value;
    setInputFields(values);
  };

  const handleAddField = () => {
    setInputFields([...inputFields, { id: Date.now(), text: '' }]);
  };

  const handleAddTexts = () => {
    const validEntries = inputFields.filter((field) => field.text.trim() !== '');
    if (validEntries.length > 0) {
      setPrevaluationTextsArray(validEntries);
      setInputFields([{ id: Date.now(), text: '' }]); // Reset to one empty input field
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <span className={styles.close} onClick={closeModal}>
            &times;
          </span>
          <h3>Prevaluation Texts</h3>
          <ul className={styles.textList}>
            {prevaluationTexts.map((item: any) => (
              <li key={item.id} className={styles.textListItem}>
                {item.text}
                <button className={styles.deleteButton} onClick={() => deleteprevaluationTextById(item.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {inputFields.map((field, index) => (
            <input
              key={field.id}
              type="text"
              value={field.text}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Enter text"
              className={styles.inputField}
            />
          ))}
          <button className={styles.addButton} onClick={handleAddField}>
            Add Another Input
          </button>
          <button className={styles.addTextsButton} onClick={handleAddTexts}>
            Add Texts
          </button>
        </div>
      </div>
    </>
  );
};

export default PrevaluationModal;
