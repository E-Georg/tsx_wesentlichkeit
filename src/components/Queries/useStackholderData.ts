import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClientTypes } from '../../utils/data.interfaces';
import {
  AddDataToDataBaseQuery,
  DeleteDataFromDatabaseQuery,
  fetchDataQuery,
  UpdateDataToDatabaseQuery,
} from '../../services/ApiService';
import { useStore } from '../../store';

const useStackholderData = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();

  // Fetch Stackholder data
  const {
    data: Stackholder,
    status,
    isLoading: isLoadingStack,
  } = useQuery({
    queryKey: ['Stackholder'],
    queryFn: () => fetchDataQuery(ClientTypes.Stakeholders, ClientID),
    staleTime: Infinity,
  });

  // Add Stackholder mutation
  const { mutateAsync: addStackholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) =>
      AddDataToDataBaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stackholder'] });
    },
  });

  //   // Delete Stackholder mutation
  const { mutateAsync: deleteStackholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) => DeleteDataFromDatabaseQuery({ matrixObject, typeParameter }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stackholder'] });
    },
  });

  //   // Update Stackholder mutation
  const { mutateAsync: updateStackholderMutation } = useMutation({
    mutationFn: ({ matrixObject, typeParameter }: any) =>
      UpdateDataToDatabaseQuery({ matrixObject, typeParameter, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Stackholder'] });
    },
  });

  return {
    Stackholder,
    status,
    isLoadingStack,
    addStackholderMutation,
    deleteStackholderMutation,
    updateStackholderMutation,
  };
};

export default useStackholderData;
