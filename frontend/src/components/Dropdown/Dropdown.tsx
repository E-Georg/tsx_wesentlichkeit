import { useNavigate } from 'react-router-dom';
import './Dropdown.css';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { messageValue } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { handleSelectChange } from './DropdownFuntion';
import { useEffect } from 'react';

interface Props {
  stakeholderID: number;
  index: number;
  setMessageValueByIndex: any; //(index: number, value: messageValue) => void;
  messageValue: messageValue;
}

const Dropdown = ({ index, stakeholderID, setMessageValueByIndex, messageValue }: Props) => {
  const navigate = useNavigate();
  const { SubStakeholder: SubStakeholderQuery } = useSubStakeholderData();

  useEffect(() => {
    if (sessionStorage) {
      sessionStorage.clear();
    }
  }, []);

  const filteredSubStakeholders =
    SubStakeholderQuery?.length! >= 1 ? SubStakeholderQuery?.filter((option: SubStakeholder) => option.stakeholderId === stakeholderID) : [];

  const options = filteredSubStakeholders!.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  return (
    <div className="dropdown-container">
      <SelectDropdown
        options={options}
        style={{ height: '2rem' }}
        value={messageValue.subStakeholderId}
        onChange={(event) => handleSelectChange(setMessageValueByIndex, index, messageValue, event)}
        placeholder="Substakeholder auswählen"
      />

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>Zur Substakeholderliste</button>
    </div>
  );
};

export default Dropdown;
