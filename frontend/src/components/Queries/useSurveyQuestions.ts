import { useQuery } from '@tanstack/react-query';
import { fetchSurveyQuestions } from '../../services/ApiService';
import { useStore } from '../../store';

const useSurveyQuestions = () => {
  const { ClientID } = useStore();
  // Fetch SurveyQuestions
  const {
    data: SurveyQuestions,
    status,
    isLoading: isLoadingQuestions,
  } = useQuery({
    queryKey: ['Questions'],
    queryFn: () => fetchSurveyQuestions(ClientID),
    staleTime: Infinity,
  });

  return {
    SurveyQuestions,
    status,
    isLoadingQuestions,
  };
};

export default useSurveyQuestions;
