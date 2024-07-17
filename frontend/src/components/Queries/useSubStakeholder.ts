import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AddSubStakeholderToDataBaseQuery,
  DeleteSubStakeholderFromDatabaseQuery,
  fetchDataQuerySubStakeholder,
  UpdateSubStakeholderToDatabaseQuery,
} from '../../services/ApiService';

const useSubStakeholderData = () => {
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
    mutationFn: ({ newStakeholder }: any) => AddSubStakeholderToDataBaseQuery({ newStakeholder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholder'] });
    },
  });

  //   // Delete Stakeholder mutation
  const { mutateAsync: deleteSubStakeholderMutation } = useMutation({
    mutationFn: (ID: any) => DeleteSubStakeholderFromDatabaseQuery(ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholder'] });
    },
  });

  // Update Stakeholder mutation
  const { mutateAsync: updateStakeholderMutation } = useMutation({
    mutationFn: ({ newStakeholder }: any) => UpdateSubStakeholderToDatabaseQuery({ newStakeholder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubStakeholder'] });
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
