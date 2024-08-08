import React from 'react';

interface GroupActionCheckboxProps {
  groupId: number;
  state: any;
  setState: any;
}

const GroupActionCheckbox: React.FC<GroupActionCheckboxProps> = ({ groupId, state, setState }) => {
  const updateIsChecked = (id: any, newIsChecked: any) => {
    setState((prevState: any) =>
      prevState.map((obj: any) => (obj.groupId === id ? { ...obj, relevance: newIsChecked } : obj))
    );
  };

  return (
    <input
      type="checkbox"
      checked={state}
      onChange={(event) => updateIsChecked(groupId, event.target.checked === true ? 1 : 0)}
    />
  );
};

export default GroupActionCheckbox;
