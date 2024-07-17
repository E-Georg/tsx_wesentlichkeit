import { useNavigate } from 'react-router-dom';
import './Dropdown.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';

interface Props {
  stakeholderID: number;
}

const Dropdown = ({ stakeholderID }: Props) => {
  const navigate = useNavigate();
  const { SubStakeholder: SubStakeholderQuery, isLoadingStack } = useSubStakeholderData();

  if (isLoadingStack) {
    return <div>Loading...</div>;
  }

  const filteredSubStakeholders = SubStakeholderQuery?.filter((option: any) => option.stakeholderId === stakeholderID);

  return (
    <div className="dropdown-container">
      <select>
        {filteredSubStakeholders && filteredSubStakeholders.length > 0 ? (
          filteredSubStakeholders.map((option: any, index: any) => (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          ))
        ) : (
          <option value="add">Empty</option>
        )}
      </select>

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Go to Stakeholder List</button>
    </div>
  );
};

export default Dropdown;
