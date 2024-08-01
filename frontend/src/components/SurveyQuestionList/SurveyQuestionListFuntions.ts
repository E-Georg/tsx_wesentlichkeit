import { SetSelectedValues, SetVisibleDescription, SurveyAnswer } from '../Models/data.interfaces';

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

export const handleChange = (setSurveyAnswer: SetSelectedValues, subGroupId: number, answerValue: number) => {
  setSurveyAnswer((prevValues: SurveyAnswer[]) => {
    const existingIndex = prevValues.findIndex((item) => item.subGroupId === subGroupId);
    if (existingIndex > -1) {
      // Update the existing entry
      const updatedValues = [...prevValues];
      updatedValues[existingIndex] = { subGroupId, answer: answerValue };
      return updatedValues;
    } else {
      // Add a new entry
      return [...prevValues, { subGroupId, answer: answerValue }];
    }
  });
};
