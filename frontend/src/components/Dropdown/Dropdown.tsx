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
        {SubStakeholder.map((option: any, index: any) => {
          console.log(stakeholderID);
          // show option.name if option.id is the same as stakeholderID
          return (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          );
        })}
      </select>

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Go to Stakeholder List</button>
    </div>
  );
};

export default Dropdown;
