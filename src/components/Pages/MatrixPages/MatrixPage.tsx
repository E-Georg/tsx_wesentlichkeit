import Matrix from "../../Matrix/Matrix";
import { useStore } from "../../../store";
import Modal from "../../Modal/Modal";
import useSubGroupData from "../../Queries/useSubGroupData";
import useStakeholderData from "../../Queries/useStakeholderData";
import useCellData from "../../Queries/useCellData";
import "./MartrixPage.css";

const MatrixPage = () => {
  const { title, setTitle, description, setDescription } = useStore();

  const { SubGroup, isLoading } = useSubGroupData();
  const { Stakeholder, isLoadingStack } = useStakeholderData();
  const { Cells, isLoadingCells } = useCellData();

  if (isLoading || isLoadingStack || isLoadingCells) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {Cells && Stakeholder && SubGroup && (
        // in Matrix verschieben und dann direkt beim eingang prüfen welcher mode vorhanden ist
        <div className="matrixContainer">
          <Matrix
            rows={SubGroup}
            columns={Stakeholder}
            cells={Cells}
            showAddToMatrix={true}
            setTitle={setTitle}
            setDescription={setDescription}
          />
        </div>
      )}
      <Modal
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
      />
    </>
  );
};

export default MatrixPage;
