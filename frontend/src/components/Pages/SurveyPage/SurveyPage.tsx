import { useParams } from 'react-router-dom';
import useGroupData from '../../Queries/useGroupData';
import useSurveyQuestions from '../../Queries/useSurveyQuestions';
import Survey from '../../Survey/Survey';
import { useStore } from '../../../store';
import { BUTTONS } from '../../../utils/constants';
import { handleClickOnSaveSurvey } from './SurveyPageFunctions';
import './SurveyPage.scss'; // Import the SCSS file

const SurveyPage = () => {
  const { SurveyQuestions, isLoadingQuestions, addAnswers } = useSurveyQuestions();
  const { surveyText, surveyAnswer, resetSurvey } = useStore();
  const { Group, isLoading } = useGroupData();
  const { id } = useParams();

  if (isLoadingQuestions || isLoading) {
    return <div className="loading-message">Loading ... </div>;
  }
  console.log(Number(id));

  return (
    <div className="container">
      {' '}
      {SurveyQuestions && Array.isArray(SurveyQuestions) && Group && Array.isArray(Group) && (
        <>
          <Survey SurveyQuestions={SurveyQuestions} Group={Group} subStakeholderId={Number(id)} />
          <button
            onClick={() => handleClickOnSaveSurvey(addAnswers, Number(id), surveyAnswer, surveyText, resetSurvey)}
            className="save-button"
          >
            {BUTTONS.SEND}
          </button>
        </>
      )}
    </div>
  );
};

export default SurveyPage;
