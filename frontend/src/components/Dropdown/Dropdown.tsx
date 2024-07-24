import { useNavigate } from 'react-router-dom';
import './Dropdown.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { messageValue } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { useEffect, useState } from 'react';

interface Props {
  stakeholderID: number;
  index: number;
  setMessageValueByIndex: (index: number, value: messageValue) => void;
  messageValue: messageValue;
}

const Dropdown = ({ messageValue, index, stakeholderID, setMessageValueByIndex }: Props) => {
  const navigate = useNavigate();
  const { SubStakeholder: SubStakeholderQuery, isLoadingStack } = useSubStakeholderData();
  const [value, setValue] = useState(messageValue.subStakeholderId);

  if (isLoadingStack) {
    <div>Loading...</div>;
  }

  const filteredSubStakeholders =
    SubStakeholderQuery?.length! >= 1 ? SubStakeholderQuery?.filter((option: SubStakeholder) => option.stakeholderId === stakeholderID) : [];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMessageValueByIndex(index, {
      id: messageValue.id,
      title: messageValue.title,
      text: messageValue.text,
      subStakeholderId: Number(event.target.value),
    });
  };

  const options = filteredSubStakeholders!.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  useEffect(() => {
    setValue(messageValue.subStakeholderId);
  }, [messageValue]);

  return (
    <div className="dropdown-container">
      <SelectDropdown options={options} style={{ height: '2rem' }} value={value} onChange={handleSelectChange} placeholder="Substakeholder auswählen" />

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Zur Substakeholderliste</button>
    </div>
  );
};

export default Dropdown;
