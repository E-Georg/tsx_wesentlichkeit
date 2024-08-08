import { useNavigate } from 'react-router-dom';
import './Dropdown.scss';
import useSubStakeholderData from '../Queries/useSubStakeholder';
import { messageValue } from '../../store';
import { SubStakeholder } from '../Models/data.interfaces';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { handleSelectChange } from './DropdownFuntion';
import { STRINGS } from '../../utils/constants';

interface Props {
  stakeholderID: number;
  index: number;
  setMessageValueByIndex: any; //(index: number, value: messageValue) => void;
  messageValue: messageValue;
}

const Dropdown = ({ index, stakeholderID, setMessageValueByIndex, messageValue }: Props) => {
  const navigate = useNavigate();
  const { SubStakeholder: SubStakeholderQuery } = useSubStakeholderData();

  const filteredSubStakeholders =
    SubStakeholderQuery?.length! >= 1
      ? SubStakeholderQuery?.filter((option: SubStakeholder) => option.stakeholderId === stakeholderID)
      : [];

  const options = filteredSubStakeholders!.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  return (
    <div className="dropdown-container">
      <SelectDropdown
        options={options}
        value={messageValue.subStakeholderId}
        onChange={(event) => handleSelectChange(setMessageValueByIndex, index, messageValue, event)}
        placeholder={STRINGS.CHOOSE_SUBSTAKEHOLDER}
      />

      <button onClick={() => navigate('/stakeholderlist', { state: { from: 'modal' } })}>
        {STRINGS.TO_SUBSTAKEHOLDERLIST}
      </button>
    </div>
  );
};

export default Dropdown;
