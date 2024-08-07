import React, { useState, useEffect } from "react";

interface GroupActionCheckboxProps {
  groupId: number;
  onChange: (groupId: number, isChecked: boolean) => void;
  groupRelevance?: boolean | number;
}

const GroupActionCheckbox: React.FC<GroupActionCheckboxProps> = ({
  groupId,
  onChange,
  groupRelevance,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof groupRelevance === "number") {
      setIsChecked(groupRelevance === 1);
    } else {
      setIsChecked(Boolean(groupRelevance));
    }
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
