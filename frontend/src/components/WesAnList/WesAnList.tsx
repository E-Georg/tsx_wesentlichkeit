import { Fragment, useState } from 'react';
import useGroupSubGroupData from '../Queries/useGroupSubGroup';
import useSurveyQuestionAverageValues from '../Queries/useSurveyQuestionAverageValues';
import './WesAnList.css';

const WesAnList = () => {
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage } = useSurveyQuestionAverageValues();
  const { GroupSubGroup2, isLoadingGroupSubGroup } = useGroupSubGroupData();
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  let groupAverageMap;
  let subgroupAverageMap;

  if (isLoadingQuestionsAverage || isLoadingGroupSubGroup) {
    return <div>...Loading</div>;
  } else {
    // Create a mapping of groupId to groupAverage
    groupAverageMap = SurveyQuestionAverageValues.reduce((acc: any, curr: any) => {
      acc[curr.groupId] = curr.groupAverage;
      return acc;
    }, {} as Record<number, string>);

    // Create a mapping of subGroupId to subgroupAverage
    subgroupAverageMap = SurveyQuestionAverageValues.reduce((acc: any, curr: any) => {
      if (curr.subGroups) {
        curr.subGroups.forEach((subGroup: any) => {
          acc[subGroup.subGroupId] = subGroup.subgroupAverage;
        });
      }
      return acc;
    }, {} as Record<number, string>);
  }

  const toggleGroup = (groupId: number) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="column-title">Group Title</th>
            <th className="column-other">Average</th>
            <th className="column-other">Hello 2</th>
            <th className="column-checkbox">Checkbox</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(GroupSubGroup2) &&
            !isLoadingGroupSubGroup &&
            !isLoadingQuestionsAverage &&
            GroupSubGroup2.map((group: any) => (
              <Fragment key={group.groupId}>
                {/* Group Title Row */}
                <tr className="group-row">
                  <td className="column-title" onClick={() => toggleGroup(group.groupId)}>
                    {group.groupTitle}
                  </td>
                  <td className="column-other">{groupAverageMap[group.groupId] || 'N/A'}</td>
                  <td className="column-other">Hello 2</td>
                  <td className="column-checkbox">
                    <input type="checkbox" />
                  </td>
                </tr>

                {/* SubGroup Rows */}
                {expandedGroupId === group.groupId &&
                  group.subGroups.map((subGroup: any) => (
                    <tr key={subGroup.subGroupId} className="subgroup-row">
                      <td className="column-title">{subGroup.subGroupTitle || 'N/A'}</td>
                      <td className="column-other">{subgroupAverageMap[subGroup.subGroupId] || 'N/A'}</td>
                      <td className="column-other">Hello 2</td>
                      <td className="column-checkbox">{/* <input type="checkbox" /> */}</td>
                    </tr>
                  ))}
              </Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default WesAnList;
