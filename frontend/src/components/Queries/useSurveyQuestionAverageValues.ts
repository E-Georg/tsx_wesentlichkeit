import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store';
import { fetchGroupSubGroupAverageValues, fetchSubStakeholderAverageAnswer, fetchSubStakeholderComments } from '../../services/ApiServiceAverageValues';

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

  const { data: SubStakeholderSurveyQuestionComments, isLoading: isLoadingSubStakeholderComments } = useQuery({
    queryKey: ['SubStakeholderSurveyQuestionComments'],
    queryFn: () => fetchSubStakeholderComments(ClientID),
    staleTime: Infinity,
  });

  return {
    SurveyQuestionAverageValues,
    status,
    isLoadingQuestionsAverage,
    SubStakeholderSurveyQuestionAverageValues,
    isLoadingSubStakeholderQuestionsAverage,
    SubStakeholderSurveyQuestionComments,
    isLoadingSubStakeholderComments,
  };
};

export default useSurveyQuestionAverageValues;
