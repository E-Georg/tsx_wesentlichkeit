import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AddSubStakeholderToDataBaseQuery,
  DeleteSubStakeholderFromDatabaseQuery,
  fetchDataQuerySubStakeholder,
  UpdateSubStakeholderToDatabaseQuery,
} from '../../services/ApiService';
import { useStore } from '../../store';

const useSubStakeholderData = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();

  // Fetch Stakeholder data
  const {
    data: SubStakeholder,
    status,
    isLoading: isLoadingStack,
  } = useQuery({
    queryKey: ['SubStakeholder'],
    queryFn: () => fetchDataQuerySubStakeholder(),
    staleTime: Infinity,
  });

  // Add Stakeholder mutation
  const { mutateAsync: addSubStakeholderMutation } = useMutation({
    mutationFn: ({ subStakeholder }: any) => AddSubStakeholderToDataBaseQuery({ subStakeholder, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholder'] });
    },
  });

  //   // Delete Stakeholder mutation
  const { mutateAsync: deleteSubStakeholderMutation } = useMutation({
    mutationFn: ({ subStakeholder }: any) => DeleteSubStakeholderFromDatabaseQuery({ subStakeholder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholder'] });
    },
  });

  // Update Stakeholder mutation
  const { mutateAsync: updateStakeholderMutation } = useMutation({
    mutationFn: ({ subStakeholder }: any) => UpdateSubStakeholderToDatabaseQuery({ subStakeholder, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stakeholder'] });
    },
  });

  return {
    SubStakeholder,
    addSubStakeholderMutation,
    deleteSubStakeholderMutation,
    updateStakeholderMutation,
    status,
    isLoadingStack,
  };
};

export default useSubStakeholderData;
