import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteCellFromDatabaseQuery, fetchCellsQuery, UpdateCellsToDatabaseQuery, AddCellToDataBaseQuery, DeleteMessageFromCell } from '../../services/ApiService';
import { useStore } from '../../store';

const useCellData = () => {
  const { ClientID } = useStore();
  const queryClient = useQueryClient();

  // Fetch Cells data
  const { data: Cells, isLoading: isLoadingCells } = useQuery({
    queryKey: ['Cells'],
    queryFn: () => fetchCellsQuery(ClientID),
    staleTime: Infinity,
  });

  // Add Cells mutation
  const { mutateAsync: addCellsMutation } = useMutation({
    mutationFn: ({ cell }: any) => AddCellToDataBaseQuery({ cell, ClientID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Cells'] });
    },
  });

  // Delete Cells mutation
  const { mutateAsync: deleteCellsMutation } = useMutation({
    mutationFn: ({ ID }: any) => DeleteCellFromDatabaseQuery({ ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Cells'] });
    },
  });

  // Delete Cell mutation
  const { mutateAsync: deleteCellMutation } = useMutation({
    mutationFn: (ID: number) => DeleteMessageFromCell(ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Cells'] });
    },
  });

  //   // Update Cells mutation
  const { mutateAsync: updateCellsMutation } = useMutation({
    mutationFn: ({ cell }: any) => UpdateCellsToDatabaseQuery({ cell }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Cells'] });
    },
  });

  return {
    Cells,
    isLoadingCells,
    addCellsMutation,
    deleteCellsMutation,
    deleteCellMutation,
    updateCellsMutation,
  };
};

export default useCellData;
