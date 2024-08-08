import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../../store';
import {
  fetchGroupSubGroupAverageValues,
  fetchSubStakeholderAverageAnswer,
  fetchSubStakeholderComments,
  UpdateRelevanceGroup,
} from '../../services/ApiServiceAverageValues';
import { checkedBox } from '../WesAnListSimple/WesAnListSimple';

const useSurveyQuestionAverageValues = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();
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

  const { mutateAsync: updateRelevance } = useMutation({
    mutationFn: (state: checkedBox[]) => UpdateRelevanceGroup(ClientID, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholderSurveyQuestionAverageValues'] });
    },
  });

  return {
    updateRelevance,
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
