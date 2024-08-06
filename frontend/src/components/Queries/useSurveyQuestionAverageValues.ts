import { useQuery } from '@tanstack/react-query';
import { fetchGroupSubGroupAverageValues } from '../../services/ApiService';
import { useStore } from '../../store';
import { fetchSubStakeholderAverageAnswer } from '../../services/ApiServiceAverageValues';

const useSurveyQuestionAverageValues = () => {
  const { ClientID } = useStore();
  // Fetch SurveyQuestions
  const {
    data: SurveyQuestionAverageValues,
    status,
    isLoading: isLoadingQuestionsAverage,
  } = useQuery({
    queryKey: ['SurveyQuestionAverageValues'],
    queryFn: () => fetchGroupSubGroupAverageValues(ClientID),
    staleTime: Infinity,
  });

  const { data: SubStakeholderSurveyQuestionAverageValues, isLoading: isLoadingSubStakeholderQuestionsAverage } = useQuery({
    queryKey: ['SubStakeholderSurveyQuestionAverageValues'],
    queryFn: () => fetchSubStakeholderAverageAnswer(ClientID),
    staleTime: Infinity,
  });

  return {
    SurveyQuestionAverageValues,
    status,
    isLoadingQuestionsAverage,
    SubStakeholderSurveyQuestionAverageValues,
    isLoadingSubStakeholderQuestionsAverage,
  };
};

export default useSurveyQuestionAverageValues;
