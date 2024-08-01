import { useParams } from 'react-router-dom';
import useGroupData from '../../Queries/useGroupData';
import useSurveyQuestions from '../../Queries/useSurveyQuestions';
import Survey from '../../Survey/Survey';
import { useStore } from '../../../store';
import { BUTTONS, COLORS } from '../../../utils/constants';
import { handleClickOnSaveSurvey } from './SurveyPageFunctions';

const SurveyPage = () => {
  const { SurveyQuestions, isLoadingQuestions, addAnswers } = useSurveyQuestions();
  const { surveyText, surveyAnswer, resetSurvey } = useStore();
  const { Group, isLoading } = useGroupData();
  // const { subStakeholderId } = useParams();
  const subStakeholderId = 4;

  if (isLoadingQuestions || isLoading) {
    <div>Loading ... </div>;
  }

  return (
    <>
      {SurveyQuestions && Array.isArray(SurveyQuestions) && Group && Array.isArray(Group) && (
        <>
          <Survey SurveyQuestions={SurveyQuestions} Group={Group} />
          <button
            onClick={() => handleClickOnSaveSurvey(addAnswers, Number(subStakeholderId), surveyAnswer, surveyText, resetSurvey)}
            style={{ width: '100%', backgroundColor: COLORS.TERTIARY }}
          >
            {BUTTONS.SEND}
          </button>
        </>
      )}
    </>
  );
};

export default SurveyPage;
