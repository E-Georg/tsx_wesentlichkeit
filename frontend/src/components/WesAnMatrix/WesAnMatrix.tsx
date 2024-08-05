import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import React, { useState } from "react";
import "./WesAnMatrix.css";
import useStakeholderData from "../Queries/useStakeholderData";

type Props = {};

const WesAnMatrix = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();

  const [visibleGroups, setVisibleGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const handleToggle = (groupId: string) => {
    setVisibleGroups((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  if (load) {
    return <div>Loading...</div>;
  }

  const stakeholderCount = 3;
  const uniqueGroups = GroupSubGroup.map((item) => ({
    groupId: item.groupId,
    groupTitle: item.groupTitle,
  })).filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) => t.groupId === value.groupId && t.groupTitle === value.groupTitle
      )
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Group Title</th>
          {[...Array(stakeholderCount)].map((_, index) => (
            <th key={index}>Stakeholder {index + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {uniqueGroups.map((group) => (
          <React.Fragment key={group.groupId}>
            <tr className="title-blue">
              {group.groupTitle} {group.groupId}
              <button onClick={() => handleToggle(group.groupId)}>
                {group.groupTitle}
              </button>
            </tr>
            {visibleGroups[group.groupId] &&
              GroupSubGroup.filter(
                (subGroup) => subGroup.groupId === group.groupId
              ).map((subGroup) => (
                <tr key={subGroup.subGroupId} className="title-green">
                  <td>
                    {subGroup.subGroupTitle} {group.groupId}
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default WesAnMatrix;
