import { useState } from 'react';
import { useStore } from '../../store';
import styles from './PrevaluationModal.module.css'; // Corrected import
import { BUTTONS, STRINGS } from '../../utils/constants';
import TrashButton from '../TrashButton/TrashButton';

type Props = {
  setModalVisible: (visible: boolean) => void;
};

// Man sieht alle Subgroups und kann den Text ausklappen
// Man sieht alle Fälle zu dem Gruppe / Untergruppe
// Mehrere Input und dann Adden

const PrevaluationModal = ({ setModalVisible }: Props) => {
  const { prevaluationTexts, setPrevaluationTextsArray, deleteprevaluationTextById } = useStore();

  // Local state to manage dynamic input fields
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

  const handleDeleteField = (index: number) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleSave = () => {
    const validEntries = inputFields.filter((field) => field.text.trim() !== '');
    if (validEntries.length > 0) {
      setPrevaluationTextsArray([...prevaluationTexts, ...validEntries]);
      setInputFields([{ id: Date.now(), text: '' }]);
    }
  };

  const handleDeleteSaved = async (id: number) => {
    deleteprevaluationTextById(id);
  };

  return (
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
              <TrashButton handleClick={() => handleDeleteSaved(item.id)} />
            </li>
          ))}
        </ul>

        {inputFields.map((field, index) => (
          <div key={field.id} className={styles.inputContainer}>
            <input type="text" value={field.text} onChange={(event) => handleInputChange(index, event)} placeholder={STRINGS.ADD_CASE} className={styles.inputField} />
            <TrashButton handleClick={() => handleDeleteField(index)} />
          </div>
        ))}

        <button className={styles.addButton} onClick={handleAddField}>
          {BUTTONS.ADD}
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          {BUTTONS.SAVE}
        </button>
      </div>
    </div>
  );
};

export default PrevaluationModal;
