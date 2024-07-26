import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClientTypes } from '../Models/data.interfaces';
import { AddDataToDataBaseQuery, DeleteDataFromDatabaseQuery, fetchDataQuery, UpdateDataToDatabaseQuery } from '../../services/ApiService';
import { useStore } from '../../store';

const useGroupData = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();

  // Fetch SubGroup data
  const { data: Group, isLoading } = useQuery({
    queryKey: ['Group'],
    queryFn: () => fetchDataQuery(ClientTypes.Groups, ClientID),
    staleTime: Infinity,
  });

  // Add SubGroup mutation
  const { mutateAsync: addGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => AddDataToDataBaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Group'] });
    },
  });

  // Delete SubGroup mutation
  const { mutateAsync: deleteGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => DeleteDataFromDatabaseQuery({ matrixObject, typeParameter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Group'] });
    },
  });

  // Update SubGroup mutation
  const { mutateAsync: updateGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => UpdateDataToDatabaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Group'] });
    },
  });

  return {
    Group,
    isLoading,
    addGroupMutation,
    deleteGroupMutation,
    updateGroupMutation,
  };
};

export default useGroupData;
