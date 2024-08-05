import { useQuery } from '@tanstack/react-query';
import { ClientTypes } from '../Models/data.interfaces';
import { fetchGroupSubGroup, fetchGroupSubGroup2 } from '../../services/ApiService';
import { useStore } from '../../store';

const useGroupSubGroupData = () => {
  const { ClientID } = useStore();

  // Fetch SubGroup data
  const { data: GroupSubGroup, isLoading } = useQuery({
    queryKey: ['GroupSubGroup'],
    queryFn: () => fetchGroupSubGroup(ClientTypes.GroupSubGroup, ClientID),
    staleTime: Infinity,
  });

  const { data: GroupSubGroup2, isLoading: isLoadingGroupSubGroup } = useQuery({
    queryKey: ['GroupSubGroup2'],
    queryFn: () => fetchGroupSubGroup2(ClientTypes.GroupSubGroup, ClientID),
    staleTime: Infinity,
  });

  return {
    GroupSubGroup2,
    isLoadingGroupSubGroup,
    GroupSubGroup,
    isLoading,
  };
};

export default useGroupSubGroupData;
