import './Modal.css';
import { useStore } from '../../store';
import { HttpAction } from '../Models/data.interfaces';
import useSubGroupData from '../Queries/useSubGroupData';
import useStakeholderData from '../Queries/useStakeholderData';
import useCellData from '../Queries/useCellData';
import { CellFunction, StakeholderFunction, SubgroupFunction } from './ModalFunction';
import ModalCells from '../ModalCells/ModalCells';
import ModalTable from '../ModalTable/ModalTable';

interface Props {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (text: string) => void;
}

const Modal = ({ title, description, setTitle, setDescription }: Props) => {
  const {
    showModal,
    cellID,
    reset,
    onChangeSubGroup,
    onChangeStakeholder,
    onChangeCells,
    classification,
    setClassification,
    messageValue,
    setMessageValue,
    setMessageValueByIndex,
  } = useStore();

  const { addSubGroupMutation, deleteSubGroupMutation, updateSubGroupMutation } = useSubGroupData();
  const { addStakeholderMutation, deleteStakeholderMutation, updateStakeholderMutation } = useStakeholderData();
  const { deleteCellsMutation, updateCellsMutation, addCellsMutation } = useCellData();

  const handleModalData = async () => {
    console.log('in in ModalData');
    console.log(onChangeStakeholder.mode);
    console.log(onChangeSubGroup.mode);
    console.log(onChangeCells.mode);

    //===============================================================SUBGROUP===================================================================
    if (onChangeSubGroup.mode !== HttpAction.DEFAULT) {
      console.log(description);
      SubgroupFunction(deleteSubGroupMutation, updateSubGroupMutation, addSubGroupMutation, onChangeSubGroup, title, description);
    }
    //==========================================================STAKEHOLDER========================================================================
    if (onChangeStakeholder.mode !== HttpAction.DEFAULT) {
      console.log(description);
      StakeholderFunction(deleteStakeholderMutation, updateStakeholderMutation, addStakeholderMutation, onChangeStakeholder, title, description, classification);
    }

    // ============================================================CELLS============================================================================
    if (onChangeCells.mode !== HttpAction.DEFAULT) {
      CellFunction(deleteCellsMutation, updateCellsMutation, addCellsMutation, onChangeCells, messageValue, cellID);
    }
    reset();
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Modal-Title</h2>
          <img src="/src/assets/close.svg" alt="close" className="close" onClick={reset} />
        </div>
        <button onClick={() => setMessageValue({ title: '', text: '' })}>Add</button>

        {onChangeCells.mode !== HttpAction.DEFAULT && (
          <ModalCells cellID={cellID} messageValue={messageValue} onChangeCells={onChangeCells} setMessageValueByIndex={setMessageValueByIndex} />
        )}

        {onChangeSubGroup.mode !== HttpAction.DEFAULT && <ModalTable description={description} setDescription={setDescription} setTitle={setTitle} title={title} />}

        {onChangeStakeholder.mode != HttpAction.DEFAULT && (
          <ModalTable
            description={description}
            setDescription={setDescription}
            setTitle={setTitle}
            title={title}
            classification={classification}
            setClassification={setClassification}
          />
        )}

        <button onClick={handleModalData} style={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
          SAVE DATA
        </button>
      </div>
    </div>
  );
};

export default Modal;
