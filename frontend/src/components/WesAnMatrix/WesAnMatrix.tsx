import React, { useState, useEffect } from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import useStakeholderData from "../Queries/useStakeholderData";
import "./WesAnMatrix.scss";

interface Props {}

const WesAnMatrix: React.FC<Props> = () => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage } =
    useSurveyQuestionAverageValues();
  const { Stakeholder, isLoadingStake } = useStakeholderData();

  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [groupCheckboxStates, setGroupCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [visibleGroups, setVisibleGroups] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (
      !load &&
      !isLoadingQuestionsAverage &&
      GroupSubGroup &&
      SurveyQuestionAverageValues
    ) {
      // Transform SurveyQuestionAverageValues
      const groupedData = SurveyQuestionAverageValues.map((group) => {
        const groupAverage =
          SurveyQuestionAverageValues.find((sq) => sq.groupId === group.groupId)
            ?.groupAverageTotal || 0;

        const subGroups = group.subGroups.map((subGroup) => {
          const subgroupAverage =
            SurveyQuestionAverageValues.find(
              (sq) => sq.subGroupId === subGroup.subGroupId
            )?.subgroupAverage || 0;
          return { ...subGroup, subgroupAverage };
        });

        return { ...group, groupAverageTotal: groupAverage, subGroups };
      });

      setTransformedData(groupedData);

      const initialCheckboxStates = {};
      const initialGroupCheckboxStates = {};
      const initialVisibleGroups = {};
      groupedData.forEach((group) => {
        initialGroupCheckboxStates[group.groupId] = false;
        initialVisibleGroups[group.groupId] = false; // Default to not visible
        group.subGroups.forEach((subGroup) => {
          initialCheckboxStates[subGroup.subGroupId] = false;
        });
      });

      setCheckboxStates(initialCheckboxStates);
      setGroupCheckboxStates(initialGroupCheckboxStates);
      setVisibleGroups(initialVisibleGroups);
    }
  }, [
    GroupSubGroup,
    SurveyQuestionAverageValues,
    load,
    isLoadingQuestionsAverage,
  ]);

  const handleToggle = (groupId: string) => {
    setVisibleGroups((prevState) => {
      const newVisibleGroups = {
        ...prevState,
        [groupId]: !prevState[groupId],
      };
      console.log(
        "Toggled group:",
        groupId,
        "New visibility state:",
        newVisibleGroups
      );
      return newVisibleGroups;
    });
  };

  const handleCheckboxChange = (subGroupId: string) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [subGroupId]: !prevState[subGroupId],
    }));
  };

  const handleGroupCheckboxChange = (groupId: string) => {
    const isChecked = !groupCheckboxStates[groupId];
    setGroupCheckboxStates((prevState) => ({
      ...prevState,
      [groupId]: isChecked,
    }));

    setCheckboxStates((prevState) => {
      const updatedStates = { ...prevState };
      transformedData
        .find((item) => item.groupId === groupId)
        ?.subGroups.forEach((item) => {
          updatedStates[item.subGroupId] = isChecked;
        });
      return updatedStates;
    });
  };

  const getGroupAverage = (id: string) => {
    const group = transformedData.find((item) => item.groupId === id);
    return group ? group.groupAverageTotal : null;
  };

  const getSubGroupAverage = (groupId: string, subGroupId: string) => {
    const group = transformedData.find((item) => item.groupId === groupId);
    if (group) {
      const subGroup = group.subGroups.find(
        (sub) => sub.subGroupId === subGroupId
      );
      return subGroup ? subGroup.subgroupAverage : null;
    }
    return null;
  };

  if (load || isLoadingQuestionsAverage || isLoadingStake) {
    return <div>Loading...</div>;
  }

  const stakeholderCount = Stakeholder?.length || 0;

  const collectCheckboxData = () => {
    return Object.entries(checkboxStates)
      .filter(([subGroupId, isChecked]) => isChecked)
      .map(([subGroupId]) => ({
        SubGroupId: subGroupId,
        Value: 1,
      }));
  };

  const logData = () => {
    const dataToLog = collectCheckboxData();
    console.log("Selected Checkbox Data:", dataToLog);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Group Title</th>
            <th>Wesentlich bewerten</th>
            <th>Gesamt Punkte</th>
            {Stakeholder.map((stakeholder) => (
              <th key={`stakeholder-${stakeholder.id}`}>{stakeholder.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformedData.map((group) => (
            <React.Fragment key={`group-${group.groupId}`}>
              <tr>
                <td className="title-blue">
                  <div className="WesAn-group-container">
                    <span className="chkbox-title-container">
                      <span
                        onClick={() => handleToggle(group.groupId)}
                        style={{ cursor: "pointer" }}
                      >
                        {group.groupTitle}
                      </span>
                    </span>
                  </div>
                </td>
                <td>
                  <input
                    className="WesAn-checkbox"
                    type="checkbox"
                    checked={groupCheckboxStates[group.groupId] || false}
                    onChange={() => handleGroupCheckboxChange(group.groupId)}
                  />
                </td>
                <td>{getGroupAverage(group.groupId)}</td>
                {[...Array(stakeholderCount)].map((_, index) => (
                  <td key={`header-${index}`}></td>
                ))}
              </tr>
              {visibleGroups[group.groupId] &&
                group.subGroups.map((subGroup) => (
                  <tr
                    key={`subGroup-${subGroup.subGroupId}`}
                    className="title-green "
                  >
                    <td>
                      <div className="WesAn-group-container">
                        <span className="chkbox-title-container">
                          {subGroup.subGroupTitle}
                        </span>
                      </div>
                    </td>
                    <td>
                      <input
                        className="WesAn-checkbox"
                        type="checkbox"
                        checked={checkboxStates[subGroup.subGroupId] || false}
                        onChange={() =>
                          handleCheckboxChange(subGroup.subGroupId)
                        }
                      />
                    </td>
                    <td>{subGroup.subgroupAverage}</td>
                    {[...Array(stakeholderCount)].map((_, index) => (
                      <td key={`subGroup-header-${index}`}></td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button onClick={logData}>Submit</button>
    </div>
  );
};

export default WesAnMatrix;
