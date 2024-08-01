import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { SurveyText } from '../../../store';
import { AddSurveyQuestionAnswersParams, SurveyAnswer } from '../../Models/data.interfaces';

export const handleClickOnSaveSurvey = async (
  addAnswers: UseMutateAsyncFunction<any, Error, AddSurveyQuestionAnswersParams, unknown>,
  subStakeholderId: number,
  surveyAnswer: SurveyAnswer[],
  surveyText: SurveyText[],
  resetSurvey: () => void
) => {
  await addAnswers({ subStakeholderID: Number(subStakeholderId), message: surveyAnswer, comment: surveyText });
  resetSurvey();
};
