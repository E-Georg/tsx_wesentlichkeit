import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import './Dropdown.css';

interface Props {
  stakeholderID: number;
}
const Dropdown = ({ stakeholderID }: Props) => {
  const { SubStakeholder } = useStore();
  const navigate = useNavigate();

  return (
    <div className="dropdown-container">
      <select>
        {SubStakeholder.filter((option: any) => {
          return option.stakeholderId === stakeholderID;
        }).length > 0 ? (
          SubStakeholder.filter((option: any) => option.stakeholderId === stakeholderID).map(
            (option: any, index: any) => (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            )
          )
        ) : (
          <option value="add">Empty</option>
        )}
      </select>

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Go to Stakeholder List</button>
    </div>
  );
};

export default Dropdown;
