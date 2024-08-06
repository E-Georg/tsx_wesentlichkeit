import { SurveyText } from '../../store';
import { SurveyAnswer } from '../Models/data.interfaces';

export const handleChangeInput = (setSurveyText: (obj: SurveyText) => void, subStakeholderId: number, event: React.ChangeEvent<HTMLTextAreaElement>, groupId: number) => {
  setSurveyText!!({ text: event.target.value, groupId: groupId, SubStakeholderId: Number(subStakeholderId) });

  console.log({ text: event.target.value, groupId: groupId, SubStakeholderId: subStakeholderId });
};

export const handleClick = async (addAnswers: any, subStakeholderId: number, surveyAnswer: SurveyAnswer[], surveyText: SurveyText[], resetSurvey: () => void) => {
  console.log(subStakeholderId);
  await addAnswers({ subStakeholderID: Number(subStakeholderId), message: surveyAnswer, comment: surveyText });
  resetSurvey();
};
