import './SelectDropdown.scss'; // Import the SCSS file
import { Option } from '../../store';

type Props = {
  options: Option[];
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  slice?: boolean;
  defaultValue?: number;
  disabled?: boolean;
};

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder,

  defaultValue = 0,
  slice = false,
  disabled = false,
}: Props) => {
  if (slice) {
    options = options.slice(0, -1);
  }

  return (
    <select value={value != null ? value : ''} onChange={onChange} className="select-dropdown" disabled={disabled}>
      {placeholder != undefined ? <option value={defaultValue}>{placeholder}</option> : ''}
      {options.map((option: Option, index: number) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
