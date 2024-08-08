import './Modal.scss';
import { useStore } from '../../store';
import { HttpAction } from '../Models/data.interfaces';
import useStakeholderData from '../Queries/useStakeholderData';
import useCellData from '../Queries/useCellData';
import { CellFunction, StakeholderFunction, SubgroupFunction } from './ModalFunction';
import ModalCells from '../ModalCells/ModalCells';
import ModalTable from '../ModalTable/ModalTable';
import useGroupData from '../Queries/useGroupData';
import { STRINGS } from '../../utils/constants';

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
    relevance,
    setRelevance,
  } = useStore();

  const { addGroupMutation, deleteGroupMutation, updateGroupMutation } = useGroupData();
  const { addStakeholderMutation, deleteStakeholderMutation, updateStakeholderMutation } = useStakeholderData();
  const { deleteCellsMutation, updateCellsMutation, addCellsMutation } = useCellData();

  const handleModalData = async () => {
    console.log('in in ModalData');
    console.log(onChangeStakeholder.mode);
    console.log(onChangeSubGroup.mode);
    console.log(onChangeCells.mode);

    //===============================================================SUBGROUP===================================================================
    if (onChangeSubGroup.mode !== HttpAction.DEFAULT) {
      SubgroupFunction(
        deleteGroupMutation,
        updateGroupMutation,
        addGroupMutation,
        onChangeSubGroup,
        title,
        description
      );
    }
    //==========================================================STAKEHOLDER========================================================================
    if (onChangeStakeholder.mode !== HttpAction.DEFAULT) {
      StakeholderFunction(
        deleteStakeholderMutation,
        updateStakeholderMutation,
        addStakeholderMutation,
        onChangeStakeholder,
        title,
        description,
        classification,
        relevance!!
      );
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

        {onChangeCells.mode !== HttpAction.DEFAULT && (
          <>
            <button onClick={() => setMessageValue({ id: Date.now(), text: '', subStakeholderId: 0 })}>
              {STRINGS.ADD}
            </button>
            <ModalCells cellID={cellID} onChangeCells={onChangeCells} />
          </>
        )}

        {onChangeSubGroup.mode !== HttpAction.DEFAULT && (
          <ModalTable description={description} setDescription={setDescription} setTitle={setTitle} title={title} />
        )}

        {onChangeStakeholder.mode != HttpAction.DEFAULT && (
          <ModalTable
            description={description}
            setDescription={setDescription}
            setTitle={setTitle}
            title={title}
            classification={classification}
            setClassification={setClassification}
            relevance={relevance}
            setRelevance={setRelevance}
          />
        )}

        <button onClick={handleModalData} style={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
          Speichern
        </button>
      </div>
    </div>
  );
};

export default Modal;
