import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useSubGroupData from '../../Queries/useSubGroupData';
import useStackholderData from '../../Queries/useStackholderData';
import useCellData from '../../Queries/useCellData';
import { Stackholder } from '../../../utils/data.interfaces';
import { useEffect, useState } from 'react';
import { options } from '../../../utils/constants';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { SubGroup, isLoading } = useSubGroupData();
  let { Stackholder, status, isLoadingStack } = useStackholderData();
  const { Cells, isLoadingCells } = useCellData();

  const [temp, setTemp] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  useEffect((): any => {
    if (status === 'success' && Stackholder) {
      setTemp(Stackholder);
    }
    if (isLoading || isLoadingStack || isLoadingCells) {
      <div>Loading...</div>;
    }
  }, [status, Stackholder]);

  const handleSelectChange = (event: any) => {
    const value = Number(event.target.value);
    setSelectedOption(value);

    if (value === 9) {
      setTemp(Stackholder);
    } else {
      setTemp(
        Stackholder?.filter((item: Stackholder) => {
          if (item.classification === null) return;
          return item.classification === value;
        })
      );
    }
  };

  return (
    <>
      {Cells && Stackholder && SubGroup && temp && (
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
