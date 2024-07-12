import { useState } from 'react';

const Dropdown = () => {
  // State to manage options in the dropdown
  const [options, setOptions] = useState(['Stakeholder 1', 'Stakeholder 2', 'Stakeholder 3']);

  // Function to add a new option
  const addOption = () => {
    const newOption = `Stakeholder ${options.length + 1}`;
    setOptions([...options, newOption]);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Dropdown menu */}
      <select style={{ marginRight: '1rem' }}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Button to add more options */}
      <button onClick={addOption}>Add</button>
    </div>
  );
};

export default Dropdown;
