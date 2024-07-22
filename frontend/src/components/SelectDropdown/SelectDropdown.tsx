import { Option } from '../../store';

type Props = {
  options: Option[];
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

const SelectDropdown = ({ options, value, onChange, placeholder, style = {}, disabled = false }: Props) => {
  return (
    <select value={value} onChange={onChange} style={{ margin: '10px 0', padding: '5px', width: '200px', height: '25px', ...style }} disabled={disabled}>
      {placeholder != undefined ? <option value={0}>{placeholder}</option> : <>''</>}
      {options.map((option: Option, index: number) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
