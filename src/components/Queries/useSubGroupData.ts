import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClientTypes } from '../../utils/data.interfaces';
import {
  AddDataToDataBaseQuery,
  DeleteDataFromDatabaseQuery,
  fetchDataQuery,
  UpdateDataToDatabaseQuery,
} from '../../services/ApiService';
import { useStore } from '../../store';

const useSubGroupData = () => {
  const { ClientID, GroupID } = useStore();
  const queryClient = useQueryClient();

  // Fetch SubGroup data
  const { data: SubGroup, isLoading } = useQuery({
    queryKey: ['SubGroup'],
    queryFn: () => fetchDataQuery(ClientTypes.SubGroups, ClientID, GroupID),
    staleTime: Infinity,
  });

  // Add SubGroup mutation
  const { mutateAsync: addSubGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) =>
      AddDataToDataBaseQuery({ matrixObject, typeParameter, ClientID, GroupID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubGroup'] });
    },
  });

  // Delete SubGroup mutation
  const { mutateAsync: deleteSubGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => DeleteDataFromDatabaseQuery({ matrixObject, typeParameter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubGroup'] });
    },
  });

  // Update SubGroup mutation
  const { mutateAsync: updateSubGroupMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) =>
      UpdateDataToDatabaseQuery({ matrixObject, typeParameter, ClientID, GroupID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SubGroup'] });
    },
  });

  return {
    SubGroup,
    isLoading,
    addSubGroupMutation,
    deleteSubGroupMutation,
    updateSubGroupMutation,
  };
};

export default useSubGroupData;
