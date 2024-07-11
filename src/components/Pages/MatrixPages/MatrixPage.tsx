import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useSubGroupData from '../../Queries/useSubGroupData';
import useStackholderData from '../../Queries/useStackholderData';
import useCellData from '../../Queries/useCellData';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { SubGroup, isLoading } = useSubGroupData();
  const { Stackholder } = useStackholderData();
  const { Cells } = useCellData();

  if (isLoading) {
    //|| isLoadingStack || isLoadingCells) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Matrix
        rows={SubGroup}
        columns={Stackholder}
        cells={Cells}
        showAddToMatrix={true}
        setTitle={setTitle}
        setDescription={setDescription}
      />

      <Modal title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
    </>
  );
};

export default MatrixPage;
