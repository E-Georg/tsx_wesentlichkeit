import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import React from "react";
import "./WesAnMatrix.css";

type Props = {};

const WesAnMatrix = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();

  if (load) {
    return <div>Loading...</div>;
  }

  // Gruppiere die Daten nach groupTitle
  const groupedData: any[] = GroupSubGroup.reduce((acc: any[], curr: any) => {
    const group = acc.find((g: any) => g.groupTitle === curr.groupTitle);
    if (group) {
      group.subGroupTitles.push(curr.subGroupTitle.trim());
    } else {
      acc.push({
        groupTitle: curr.groupTitle.trim(),
        subGroupTitles: [curr.subGroupTitle.trim()],
      });
    }
    return acc;
  }, [] as any[]);

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

  console.log(uniqueGroups);

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
            </tr>
            {GroupSubGroup.filter(
              (subGroup) => subGroup.groupId === group.groupId
            ) // Add your condition here
              .map((subGroup) => (
                <tr key={subGroup.subGroupId} className="title-green">
                  {subGroup.subGroupTitle} {group.groupId}
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default WesAnMatrix;
