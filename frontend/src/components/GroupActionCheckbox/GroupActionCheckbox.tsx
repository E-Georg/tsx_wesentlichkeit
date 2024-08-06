import React, { useState } from "react";

interface GroupActionCheckboxProps {
  groupId: number;
  onChange: (groupId: number, isChecked: boolean) => void;
}

const GroupActionCheckbox: React.FC<GroupActionCheckboxProps> = ({
  groupId,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onChange(groupId, checked);
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange}
    />
  );
};

export default GroupActionCheckbox;
