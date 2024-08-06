import React from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import useStakeholderData from "../Queries/useStakeholderData";
import "./WesAnMatrix.scss";

type Props = {};

const WesAnMatrixDetailed = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage } =
    useSurveyQuestionAverageValues();
  const { Stakeholder, isStakeholderLoading } = useStakeholderData();

  if (load || isLoadingQuestionsAverage || isStakeholderLoading) {
    return <div className="loading">Loading...</div>;
  }

  const stakeholderMap = Stakeholder.reduce((acc, stakeholder) => {
    acc[stakeholder.id] = stakeholder.title;
    return acc;
  }, {} as Record<number, string>);

  const filteredSubGroupData = SurveyQuestionAverageValues.map((group) => ({
    groupId: group.groupId,
    groupTitle: group.groupTitle,
    groupAverageTotal: group.groupAverageTotal,
    subGroups: group.subGroups,
  }));

  return (
    <div className="wes-an-matrix">
      <table className="matrix-table">
        <thead>
          <tr>
            <th className="header-group-title">Group Title</th>
            <th className="header-group-average">Group Average</th>
            <th className="header-subgroup-title">Subgroup Title</th>
            <th className="header-subgroup-average">Subgroup Average Score</th>
            {Stakeholder.map((stakeholder) => (
              <th className="header-stakeholder" key={stakeholder.id}>
                {stakeholder.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSubGroupData.map((group) => (
            <React.Fragment key={group.groupId}>
              <tr>
                <td className="group-title" rowSpan={group.subGroups.length}>
                  {group.groupTitle}
                </td>
                <td className="group-average" rowSpan={group.subGroups.length}>
                  {group.groupAverageTotal}
                </td>
                <td className="subgroup-title">
                  {group.subGroups[0]?.subGroupTitle}
                </td>
                <td className="subgroup-average">
                  {group.subGroups[0]?.subgroupAverage}
                </td>
                {Stakeholder.map((stakeholder) => (
                  <td
                    className="stakeholder-average"
                    key={`${stakeholder.id}-${group.groupId}`}
                  >
                    {group.subGroups.find(
                      (subGroup) => subGroup.stakeholderId === stakeholder.id
                    )?.subgroupAverage || "-"}
                  </td>
                ))}
              </tr>
              {group.subGroups.slice(1).map((subGroup) => (
                <tr
                  key={`${subGroup.subGroupId}-${group.groupId}-${subGroup.stakeholderId}`}
                >
                  <td className="subgroup-title">{subGroup.subGroupTitle}</td>
                  <td className="subgroup-average">
                    {subGroup.subgroupAverage}
                  </td>
                  {Stakeholder.map((stakeholder) => (
                    <td
                      className="stakeholder-average"
                      key={`${stakeholder.id}-${subGroup.subGroupId}`}
                    >
                      {subGroup.stakeholderId === stakeholder.id
                        ? subGroup.subgroupAverage
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WesAnMatrixDetailed;
