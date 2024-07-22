import { useNavigate } from 'react-router-dom';
import './Dropdown.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { messageValue } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';

interface Props {
  stakeholderID: number;
  index: number;
  setMessageValueByIndex: (index: number, value: messageValue) => void;
  messageValue: messageValue;
}

const Dropdown = ({ messageValue, index, stakeholderID, setMessageValueByIndex }: Props) => {
  const navigate = useNavigate();
  const { SubStakeholder: SubStakeholderQuery, isLoadingStack } = useSubStakeholderData();

  if (isLoadingStack) {
    return <div>Loading...</div>;
  }

  const filteredSubStakeholders = SubStakeholderQuery?.filter((option: any) => option.stakeholderId === stakeholderID);
  console.log(messageValue.subStakeholderId);
  return (
    <div className="dropdown-container">
      <select
        value={messageValue.subStakeholderId !== 0 ? messageValue.subStakeholderId : 0}
        onChange={(event) => setMessageValueByIndex(index, { title: messageValue.title, text: messageValue.text, subStakeholderId: Number(event.target.value) })}
      >
        <option value={0}>Choose Stakeholder</option>
        {filteredSubStakeholders && filteredSubStakeholders.length > 0 ? (
          filteredSubStakeholders.map((option: SubStakeholder, index: number) => (
            <option key={index} value={option.id}>
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
