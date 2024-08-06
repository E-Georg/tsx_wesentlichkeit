import { useState } from 'react';
import { VorbewertungColumns, VorbewertungData } from '../Models/data.interfaces';
import styles from './PrevaluationTable.module.css'; // Import the updated CSS module
import PrevaluationModal from '../PrevaluationModal/PrevaluationModal';

const PrevaluationTable = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {VorbewertungColumns.map((col, index) => (
              <th key={index} className={styles.header}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VorbewertungData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {VorbewertungColumns.map((col, colIndex) => (
                <td key={colIndex} className={styles.cell} onClick={col.label === 'Betrachtungsfall' ? openModal : undefined}>
                  {row[col.label as keyof typeof row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && <PrevaluationModal setModalVisible={setModalVisible} />}
    </>
  );
};

export default PrevaluationTable;
