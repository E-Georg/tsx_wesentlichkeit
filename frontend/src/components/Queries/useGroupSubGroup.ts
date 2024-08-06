import { useQuery } from '@tanstack/react-query';
import { ClientTypes } from '../Models/data.interfaces';
import { fetchGroupSubGroup } from '../../services/ApiService';
import { useStore } from '../../store';

const useGroupSubGroupData = () => {
  const { ClientID } = useStore();

  // Fetch SubGroup data
  const { data: GroupSubGroup, isLoading } = useQuery({
    queryKey: ['GroupSubGroup'],
    queryFn: () => fetchGroupSubGroup(ClientTypes.GroupSubGroup, ClientID),
    staleTime: Infinity,
  });

  return {
    GroupSubGroup,
    isLoading,
  };
};

export default useGroupSubGroupData;
