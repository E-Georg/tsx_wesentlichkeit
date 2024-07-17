import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

interface Props {
  stakeholderID: number;
}
const Dropdown = ({ stakeholderID }: Props) => {
  const { SubStakeholder } = useStore();
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <select style={{ marginRight: '1rem', height: '2rem', width: '7rem' }}>
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
