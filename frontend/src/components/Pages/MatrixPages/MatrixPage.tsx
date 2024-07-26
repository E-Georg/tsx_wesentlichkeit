import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useStakeholderData from '../../Queries/useStakeholderData';
import useCellData from '../../Queries/useCellData';
import './MatrixPage.css';
import useGroupData from '../../Queries/useGroupData';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { Group, isLoading } = useGroupData();
  let { Stakeholder, isLoadingStack } = useStakeholderData();
  const { Cells, isLoadingCells } = useCellData();

  if (isLoading || isLoadingStack || isLoadingCells) {
    return <div>Loading...</div>;
  }

  console.log(Cells);
  return (
    <>
      <div className="matrixPage">
        {Cells && Stakeholder && Group && (
          <Matrix rows={Group} columns={Stakeholder} cells={Cells} showAddToMatrix={true} setTitle={setTitle} setDescription={setDescription} />
        )}

        <Modal title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
      </div>
    </>
  );
};

export default MatrixPage;
