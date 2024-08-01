import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddSurveyQuestionAnswers, fetchSurveyQuestions } from '../../services/ApiService';
import { useStore } from '../../store';
import { AddSurveyQuestionAnswersParams } from '../Models/data.interfaces';

const useSurveyQuestions = () => {
  const queryClient = useQueryClient();
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

  // Add Stakeholder mutation
  const { mutateAsync: addAnswers } = useMutation({
    mutationFn: ({ subStakeholderID, message, comment }: AddSurveyQuestionAnswersParams) => (
      console.log(subStakeholderID, ClientID, message, comment), AddSurveyQuestionAnswers(subStakeholderID, ClientID, message, comment)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Questions'] });
    },
  });

  return {
    SurveyQuestions,
    addAnswers,
    status,
    isLoadingQuestions,
  };
};

export default useSurveyQuestions;
