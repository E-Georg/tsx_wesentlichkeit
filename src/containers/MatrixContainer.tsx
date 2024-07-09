import Matrix from '../components/Matrix/Matrix';
import { useStore } from '../store';
import Modal from '../components/Modal/Modal';
import useSubGroupData from '../components/Queries/useSubGroupData';
import useStackholderData from '../components/Queries/useStackholderData';
import useCellData from '../components/Queries/useCellData';

const MatrixContainer = () => {
  const { title, setTitle, text, setText } = useStore();

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
        setText={setText}
      />

      <Modal title={title} text={text} setTitle={setTitle} setText={setText} />
    </>
  );
};

export default MatrixContainer;
