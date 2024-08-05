import React, { useState, useEffect } from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import "./WesAnMatrix.css";

type Props = {};

const WesAnMatrix = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();

  const [visibleGroups, setVisibleGroups] = useState<{
    [key: string]: boolean;
  }>({});

  const [transformedData, setTransformedData] = useState<any[]>([]);

  useEffect(() => {
    if (!load) {
      const groupedData = GroupSubGroup.reduce((acc, item) => {
        const group = acc.find((g) => g.groupId === item.groupId);
        if (group) {
          group.subGroups.push({
            subGroupId: item.subGroupId,
            subGroupTitle: item.subGroupTitle,
          });
        } else {
          acc.push({
            groupId: item.groupId,
            groupTitle: item.groupTitle,
            subGroups: [
              {
                subGroupId: item.subGroupId,
                subGroupTitle: item.subGroupTitle,
              },
            ],
          });
        }
        return acc;
      }, []);
      setTransformedData(groupedData);
    }
  }, [GroupSubGroup, load]);

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
        {transformedData.map((group) => (
          <React.Fragment key={group.groupId}>
            <tr
              className="title-blue"
              onClick={() => handleToggle(group.groupId)}
              style={{ cursor: "pointer" }}
            >
              <td>
                {group.groupTitle} {group.groupId}
              </td>
              {[...Array(stakeholderCount)].map((_, index) => (
                <td key={index}></td>
              ))}
            </tr>
            {visibleGroups[group.groupId] &&
              group.subGroups.map((subGroup) => (
                <tr key={subGroup.subGroupId} className="title-green">
                  <td>
                    {subGroup.subGroupTitle} {group.groupId}
                  </td>
                  {[...Array(stakeholderCount)].map((_, index) => (
                    <td key={index}></td>
                  ))}
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default WesAnMatrix;
