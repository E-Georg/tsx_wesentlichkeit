import React, { useState, useEffect } from "react";

interface GroupActionCheckboxProps {
  groupId: number;
  onChange: (groupId: number, isChecked: boolean) => void;
  groupRelevance?: boolean; // Optional prop to determine initial checkbox state
}

const GroupActionCheckbox: React.FC<GroupActionCheckboxProps> = ({
  groupId,
  onChange,
  groupRelevance = false, // Default to false if not provided
}) => {
  const [isChecked, setIsChecked] = useState(groupRelevance);

  useEffect(() => {
    setIsChecked(groupRelevance);
  }, [groupRelevance]);

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
