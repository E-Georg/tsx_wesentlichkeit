import { CellID, ChangeObject, messageValue, relevance } from '../../store';
import { Cell, Group, HttpAction, Stakeholder, SubGroup, SubStakeholder } from '../Models/data.interfaces';

export const setFilterFunction = (selectedOption: number, selectedRelevance: number, setCopyColums: (columns: Stakeholder[]) => void, columns: Stakeholder[]) => {
  if (selectedOption !== 0) {
    if (selectedRelevance === 0) {
      setCopyColums(
        columns.filter((item: Stakeholder) => {
          if (item.classification === null) return false;
          return item.classification === selectedOption;
        })
      );
    } else {
      setCopyColums(
        columns.filter((item: Stakeholder) => {
          if (item.classification === null) return false;
          return item.classification === selectedOption && item.relevance === selectedRelevance;
        })
      );
    }
  } else {
    if (selectedRelevance != 0) {
      setCopyColums(
        columns.filter((item: Stakeholder) => {
          if (item.classification === null) return false;
          return item.relevance === selectedRelevance;
        })
      );
    }
  }
};

export const onClickColumn = (
  setDescription: (description: string) => void,
  column: Stakeholder,
  setTitle: (title: string) => void,
  setClassification: (classification: number) => void,
  setRelevance: (relevance: relevance) => void,
  DELETE: boolean,
  setOnChangeStakeholder: (obj: ChangeObject) => void,
  setShowModal: () => void
) => {
  setDescription(column.description);
  setTitle(column.title);
  // console.log(column.classification);
  setClassification(column.classification!!);
  setRelevance({ text: column.relevanceText!!, value: column.relevance!! });
  console.log({ text: column.relevanceText!!, value: column.relevance!! });
  // TEMPORÄR
  if (DELETE)
    setOnChangeStakeholder({
      mode: HttpAction.DELETE,
      ID: column.id,
    });
  else
    setOnChangeStakeholder({
      mode: HttpAction.UPDATE,
      ID: column.id,
    });
  setShowModal();
};

export const onClickRow = (
  setDescription: (description: string) => void,
  row: SubGroup,
  setTitle: (title: string) => void,
  DELETE: boolean,
  setOnChangeSubGroup: (obj: ChangeObject) => void,
  setShowModal: () => void
) => {
  setDescription(row.description);
  setTitle(row.title);
  // TEMPORÄR
  if (DELETE)
    setOnChangeSubGroup({
      mode: HttpAction.DELETE,
      ID: row.id,
    });
  else
    setOnChangeSubGroup({
      mode: HttpAction.UPDATE,
      ID: row.id,
    });
  setShowModal();
};

export const onClickCell = (
  cells: Cell[],
  column: Stakeholder,
  row: Group,
  setCellID: (cellID: CellID) => void,
  setShowModal: () => void,
  setOnChangeCells: (obj: ChangeObject) => void,
  setMessageValueByIndex: (index: number, messageValue: messageValue) => void,
  DELETE: boolean
) => {
  const foundCell: Cell | undefined = cells.find((c: Cell) => c.clientStakeholderId === column.id && c.clientGroupId === row.id);
  const idOfCell = foundCell === undefined ? 0 : foundCell.id;
  setCellID({
    rowID: row.id,
    coolumnID: column.id,
    cellID: idOfCell,
  });
  console.log({
    rowID: row.id,
    coolumnID: column.id,
    cellID: idOfCell,
  });

  if (!foundCell) {
    setShowModal();
    setOnChangeCells({
      mode: HttpAction.POST,
      ID: idOfCell,
    });
  } else {
    // iterate and fill the whole object

    foundCell.message.forEach((_, index: number) => {
      setMessageValueByIndex(index, {
        id: foundCell.message[index].id,
        title: foundCell.message[index].title,
        text: foundCell.message[index].text,
        subStakeholderId: foundCell.message[index].subStakeholderId,
      });
    });
    setShowModal();
    // TEMPORÄR
    if (DELETE)
      setOnChangeCells({
        mode: HttpAction.DELETE,
        ID: idOfCell,
      });
    else
      setOnChangeCells({
        mode: HttpAction.UPDATE,
        ID: idOfCell,
      });
  }
};

export const handleRelevanceChange = (event: React.ChangeEvent<HTMLSelectElement>, setSelectedRelevance: (relevance: number) => void) => {
  let value = Number(event.target.value);
  setSelectedRelevance(value);
};

export const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, setSelectedOption: (option: number) => void) => {
  let value = Number(event.target.value);
  setSelectedOption(value);
};

export const filteredStakeholderCount = (columnId: number, SubStakeholder: SubStakeholder[] = []) => {
  if (SubStakeholder && SubStakeholder.length >= 1) {
    const filteredOptions = SubStakeholder.filter((option: SubStakeholder) => option.stakeholderId === columnId);
    if (filteredOptions.length !== 0) {
      return filteredOptions.length;
    }
  }
  return null;
};
