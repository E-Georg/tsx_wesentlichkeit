import { useState } from 'react';
import { PrevaluationColumns, PrevaluationData } from '../Models/data.interfaces';
import styles from './PrevaluationTable.module.scss';
import PrevaluationModal from '../PrevaluationModal/PrevaluationModal';
import { STRINGS } from '../../utils/constants';

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
            {PrevaluationColumns.map((col, index) => (
              <th key={index} className={styles.header}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PrevaluationData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {PrevaluationColumns.map((col, colIndex) => (
                <td key={colIndex} className={styles.cell} onClick={col.label === STRINGS.CASE ? openModal : undefined}>
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
