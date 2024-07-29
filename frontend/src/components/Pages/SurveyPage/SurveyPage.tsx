import useGroupData from '../../Queries/useGroupData';
import useSurveyQuestions from '../../Queries/useSurveyQuestions';
import Survey from '../../Survey/Survey';

const SurveyPage = () => {
  const { SurveyQuestions, isLoadingQuestions } = useSurveyQuestions();
  const { Group, isLoading } = useGroupData();

  if (isLoadingQuestions || isLoading) {
    <div>Loading ... </div>;
  }
  console.log(SurveyQuestions);
  return <>{SurveyQuestions && Array.isArray(SurveyQuestions) && Group && Array.isArray(Group) && <Survey SurveyQuestions={SurveyQuestions} Group={Group} />}</>;
};

export default SurveyPage;
