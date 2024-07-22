import { MutationFunction } from '@tanstack/react-query';
import { CellID, ChangeObject, messageValue, relevance } from '../../store';
import { ClientTypes, HttpAction } from '../Models/data.interfaces';

export const SubgroupFunction = async (
  deleteSubGroupMutation: MutationFunction,
  updateSubGroupMutation: MutationFunction,
  addSubGroupMutation: MutationFunction,
  onChangeSubGroup: ChangeObject,
  title: string,
  description: string
) => {
  // DELETE
  if (onChangeSubGroup.mode === HttpAction.DELETE) {
    await deleteSubGroupMutation({
      matrixObject: {
        id: onChangeSubGroup.ID,
        title: title,
        description: description,
      },
      typeParameter: ClientTypes.SubGroups,
    });
    //
    // UPDATE
  } else if (onChangeSubGroup.mode === HttpAction.UPDATE)
    await updateSubGroupMutation({
      matrixObject: {
        id: onChangeSubGroup.ID,
        title: title,
        description: description,
      },
      typeParameter: ClientTypes.SubGroups,
    });
  //
  // POST
  else if (onChangeSubGroup.mode === HttpAction.POST)
    await addSubGroupMutation({
      matrixObject: {
        id: onChangeSubGroup.ID,
        title: title,
        description: description,
      },
      typeParameter: ClientTypes.SubGroups,
    });
};

export const StakeholderFunction = async (
  deleteStakeholderMutation: MutationFunction,
  updateStakeholderMutation: MutationFunction,
  addStakeholderMutation: MutationFunction,
  onChangeStakeholder: ChangeObject,
  title: string,
  description: string,
  classification: number,
  relevance: relevance
) => {
  if (onChangeStakeholder.mode === HttpAction.DELETE)
    await deleteStakeholderMutation({
      matrixObject: { id: onChangeStakeholder.ID },
      typeParameter: ClientTypes.Stakeholders,
    });
  //
  // UPDATE
  else if (onChangeStakeholder.mode === HttpAction.UPDATE)
    await updateStakeholderMutation({
      matrixObject: {
        id: onChangeStakeholder.ID,
        title: title,
        description: description,
        classification: classification,
        relevance: relevance,
      },
      typeParameter: ClientTypes.Stakeholders,
    });
  //
  // POST
  else if (onChangeStakeholder.mode === HttpAction.POST)
    await addStakeholderMutation({
      matrixObject: {
        id: onChangeStakeholder.ID,
        title: title,
        description: description,
        classification: classification,
        relevance: relevance,
      },
      typeParameter: ClientTypes.Stakeholders,
    });
};

export const CellFunction = async (
  deleteCellsMutation: MutationFunction,
  updateCellsMutation: MutationFunction,
  addCellsMutation: MutationFunction,
  onChangeCells: ChangeObject,
  messageValue: messageValue[],
  cellID: CellID
) => {
  if (onChangeCells.mode === HttpAction.DELETE) {
    await deleteCellsMutation({ ID: cellID.cellID });
  } else if (onChangeCells.mode === HttpAction.UPDATE) {
    await updateCellsMutation({
      cell: { id: cellID.cellID, message: messageValue },
    });
  } else if (onChangeCells.mode === HttpAction.POST) {
    await addCellsMutation({
      cell: {
        id: cellID.cellID,
        clientSubGroupId: cellID.rowID,
        clientStakeholderId: cellID.coolumnID,
        message: messageValue,
      },
    });
  }
};
