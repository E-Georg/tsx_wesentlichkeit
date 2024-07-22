import { useNavigate } from 'react-router-dom';
import './Dropdown.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { messageValue } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

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

  const filteredSubStakeholders =
    SubStakeholderQuery?.length! >= 1 ? SubStakeholderQuery?.filter((option: SubStakeholder) => option.stakeholderId === stakeholderID) : [];

  const handleSelectChange = (event: any) => {
    setMessageValueByIndex(index, {
      title: messageValue.title,
      text: messageValue.text,
      subStakeholderId: Number(event.target.value),
    });
  };

  const options = filteredSubStakeholders!.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  return (
    <div className="dropdown-container">
      <SelectDropdown
        options={options}
        value={messageValue.subStakeholderId !== 0 ? messageValue.subStakeholderId : 0}
        onChange={handleSelectChange}
        placeholder="Choose Stakeholder"
      />

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Go to Stakeholder List</button>
    </div>
  );
};

export default Dropdown;
