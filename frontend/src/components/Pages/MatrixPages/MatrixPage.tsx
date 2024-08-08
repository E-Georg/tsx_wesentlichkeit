import Matrix from '../../Matrix/Matrix';
import { useStore } from '../../../store';
import Modal from '../../Modal/Modal';
import useStakeholderData from '../../Queries/useStakeholderData';
import useCellData from '../../Queries/useCellData';
import useGroupData from '../../Queries/useGroupData';
import './MatrixPage.scss';

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { Group, isLoading } = useGroupData();
  let { Stakeholder, isLoadingStake } = useStakeholderData();
  const { Cells, isLoadingCells } = useCellData();

  if (isLoading || isLoadingStake || isLoadingCells) {
    return <div>Loading...</div>;
  }

  return (
    <div className="matrixPage">
      {Cells && Stakeholder && Group && (
        <Matrix
          rows={Group}
          columns={Stakeholder}
          cells={Cells}
          showAddToMatrix={true}
          setTitle={setTitle}
          setDescription={setDescription}
        />
      )}

      <Modal title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
    </div>
  );
};

export default MatrixPage;
