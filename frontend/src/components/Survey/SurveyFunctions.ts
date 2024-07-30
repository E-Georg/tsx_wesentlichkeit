import { SurveyText } from '../../store';
import { SurveyAnswer } from '../Models/data.interfaces';

type VisibleDescription = {
  [key: number]: boolean;
};

type SetSelectedValues = React.Dispatch<React.SetStateAction<SurveyAnswer[]>>;

type SetVisibleDescription = React.Dispatch<React.SetStateAction<VisibleDescription>>;

export const handleChange = (setSelectedValues: SetSelectedValues, subGroupId: number, value: number) => {
  setSelectedValues((prevValues) => {
    const existingIndex = prevValues.findIndex((item) => item.subGroupId === subGroupId);
    if (existingIndex > -1) {
      const updatedValues = [...prevValues];
      updatedValues[existingIndex] = { subGroupId, answers: value };
      return updatedValues;
    } else {
      return [...prevValues, { subGroupId, answers: value }];
    }
  });
};

export const closeDescription = (setVisibleDescription: SetVisibleDescription, questionId: number) => {
  setVisibleDescription((prevState) => ({
    ...prevState,
    [questionId]: false,
  }));
};

export const toggleDescription = (setVisibleDescription: SetVisibleDescription, questionId: number) => {
  setVisibleDescription((prevState) => ({
    ...prevState,
    [questionId]: !prevState[questionId],
  }));
};

export const handleChangeInput = (setSurveyText: (obj: SurveyText) => void, subStakeholderId: number, event: React.ChangeEvent<HTMLTextAreaElement>, groupId: number) => {
  setSurveyText!!({ text: event.target.value, groupId: groupId, SubStakeholderId: subStakeholderId });

  console.log({ text: event.target.value, groupId: groupId, SubStakeholderId: subStakeholderId });
};
