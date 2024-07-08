import Matrix from '../components/Matrix/Matrix';
import { useStore } from '../store';
import Modal from '../components/Modal/Modal';
import useSubGroupData from '../components/Queries/useSubGroupData';
import useStackholderData from '../components/Queries/useStackholderData';
import useCellData from '../components/Queries/useCellData';

const MatrixContainer = () => {
  const { title, setTitle, text, setText, ClientID, GroupID } = useStore();

  // useEffect(() => {
  //   fetchData(ClientTypes.Stakeholders, setColumns, ClientID);
  //   fetchData(ClientTypes.SubGroups, setRows, ClientID, GroupID);
  //   fetchCells(ClientTypes.Cells, ClientID, GroupID, setCells);
  // }, []);

  const { SubGroup, isLoading } = useSubGroupData(ClientID, GroupID);
  const { Stackholder } = useStackholderData(ClientID);
  const { Cells } = useCellData(ClientID, GroupID);

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
