import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useSubGroupData from '../../Queries/useSubGroupData';
import useStakeholderData from '../../Queries/useStakeholderData';
import useCellData from '../../Queries/useCellData';
import { Stakeholder } from '../../../utils/data.interfaces';
import { useEffect, useState } from 'react';
import { options } from '../../../utils/constants';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { SubGroup, isLoading } = useSubGroupData();
  let { Stakeholder, status, isLoadingStack } = useStakeholderData();
  const { Cells, isLoadingCells } = useCellData();

  const [temp, setTemp] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  useEffect((): any => {
    if (status === 'success' && Stakeholder) {
      setTemp(Stakeholder);
    }
    if (isLoading || isLoadingStack || isLoadingCells) {
      <div>Loading...</div>;
    }
  }, [status, Stakeholder]);

  const handleSelectChange = (event: any) => {
    const value = Number(event.target.value);
    setSelectedOption(value);

    if (value === 9) {
      setTemp(Stakeholder);
    } else {
      setTemp(
        Stakeholder?.filter((item: Stakeholder) => {
          if (item.classification === null) return;
          return item.classification === value;
        })
      );
    }
  };

  return (
    <>
      {Cells && Stakeholder && SubGroup && (
        <div>
          <select value={selectedOption} onChange={handleSelectChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Matrix
            rows={SubGroup}
            columns={temp}
            cells={Cells}
            showAddToMatrix={true}
            setTitle={setTitle}
            setDescription={setDescription}
          />
        </div>
      )}
      <Modal title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
    </>
  );
};

export default MatrixPage;
