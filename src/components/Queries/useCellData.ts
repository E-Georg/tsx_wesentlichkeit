import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteCellFromDatabaseQuery, fetchCellsQuery } from '../../services/ApiService';

const useCellData = (ClientID = 2, GroupID = 1) => {
  const queryClient = useQueryClient();

  // Fetch Cells data
  const { data: Cells, isLoading: isLoadingCells } = useQuery({
    queryKey: ['Cells'],
    queryFn: () => fetchCellsQuery(ClientID, GroupID),
    staleTime: Infinity,
  });

  // Add Cells mutation
  //   const { mutateAsync: addCellsMutation } = useMutation({
  //     mutationFn: ({ matrixObject, typeParameter, clientID, groupID }: any) =>
  //       AddDataToDataBaseQuery({ matrixObject, typeParameter, clientID, groupID }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['Cells'] });
  //     },
  //   });

  // Delete Cells mutation
  const { mutateAsync: deleteCellsMutation } = useMutation({
    mutationFn: ({ ID }: any) => DeleteCellFromDatabaseQuery({ ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Cells'] });
    },
  });

  //   // Update Cells mutation
  //   const { mutateAsync: updateCellsMutation } = useMutation({
  //     mutationFn: ({ matrixObject, typeParameter, clientID, groupID }: any) =>
  //       UpdateDataToDatabaseQuery({ matrixObject, typeParameter, clientID, groupID }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['Cells'] });
  //     },
  //   });

  return {
    Cells,
    isLoadingCells,
    // addCellsMutation,
    deleteCellsMutation,
    // updateCellsMutation,
  };
};

export default useCellData;
