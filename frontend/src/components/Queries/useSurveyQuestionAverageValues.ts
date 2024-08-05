import { useQuery } from '@tanstack/react-query';
import { fetchGroupSubGroupAverageValues } from '../../services/ApiService';
import { useStore } from '../../store';

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

  return {
    SurveyQuestionAverageValues,
    status,
    isLoadingQuestionsAverage,
  };
};

export default useSurveyQuestionAverageValues;
