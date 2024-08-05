import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClientTypes } from '../Models/data.interfaces';
import { AddDataToDataBaseQuery, DeleteDataFromDatabaseQuery, fetchDataQuery, UpdateDataToDatabaseQuery } from '../../services/ApiService';
import { useStore } from '../../store';

const useStakeholderData = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();

  // Fetch Stakeholder data
  const {
    data: Stakeholder,
    status,
    isLoading: isLoadingStake,
  } = useQuery({
    queryKey: ['Stakeholder'],
    queryFn: () => fetchDataQuery(ClientTypes.Stakeholders, ClientID),
    staleTime: Infinity,
    // select: (data) => setColumns(data),
  });

  // Add Stakeholder mutation
  const { mutateAsync: addStakeholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => AddDataToDataBaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stakeholder'] });
    },
  });

  //   // Delete Stakeholder mutation
  const { mutateAsync: deleteStakeholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => DeleteDataFromDatabaseQuery({ matrixObject, typeParameter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stakeholder'] });
    },
  });

  //   // Update Stakeholder mutation
  const { mutateAsync: updateStakeholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => UpdateDataToDatabaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stakeholder'] });
    },
  });

  return {
    Stakeholder,
    status,
    isLoadingStake,
    addStakeholderMutation,
    deleteStakeholderMutation,
    updateStakeholderMutation,
  };

};

export default useStakeholderData;
