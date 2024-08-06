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
  const { id } = useParams();

  if (isLoadingQuestions || isLoading) {
    <div>Loading ... </div>;
  }
  console.log(Number(id));

  return (
    <>
      {SurveyQuestions && Array.isArray(SurveyQuestions) && Group && Array.isArray(Group) && (
        <>
          <Survey SurveyQuestions={SurveyQuestions} Group={Group} subStakeholderId={Number(id)} />
          <button
            onClick={() => handleClickOnSaveSurvey(addAnswers, Number(id), surveyAnswer, surveyText, resetSurvey)}
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
