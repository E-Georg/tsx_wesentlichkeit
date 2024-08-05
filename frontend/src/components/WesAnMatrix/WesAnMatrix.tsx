import React, { useState, useEffect } from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import "./WesAnMatrix.css";
import useStakeholderData from "../Queries/useStakeholderData";

const WesAnMatrix = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage } =
    useSurveyQuestionAverageValues();

  const [visibleGroups, setVisibleGroups] = useState<{
    [key: string]: boolean;
  }>({});

  const [transformedData, setTransformedData] = useState<any[]>([]);

  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [groupCheckboxStates, setGroupCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});

  const { Stakeholder, isLoadingStake } = useStakeholderData();

  console.log(Stakeholder);

  useEffect(() => {
    if (!load && !isLoadingQuestionsAverage) {
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

      const initialCheckboxStates = {};
      const initialGroupCheckboxStates = {};
      GroupSubGroup.forEach((item) => {
        initialCheckboxStates[item.subGroupId] = false;
        initialGroupCheckboxStates[item.groupId] = false;
      });
      setCheckboxStates(initialCheckboxStates);
      setGroupCheckboxStates(initialGroupCheckboxStates);
    }
  }, [
    GroupSubGroup,
    SurveyQuestionAverageValues,
    load,
    isLoadingQuestionsAverage,
  ]);

  const handleToggle = (groupId: string) => {
    setVisibleGroups((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
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
      GroupSubGroup.filter((item) => item.groupId === groupId).forEach(
        (item) => {
          updatedStates[item.subGroupId] = isChecked;
        }
      );
      return updatedStates;
    });
  };

  const getGroupAverage = (id) => {
    const group = SurveyQuestionAverageValues.find(
      (item) => item.groupId === id
    );
    return group ? group.groupAverage : null;
  };

  const getSubGroupAverage = (groupId, subGroupId) => {
    const group = SurveyQuestionAverageValues.find(
      (item) => item.groupId === groupId
    );
    if (group) {
      const subGroup = group.subGroups.find(
        (sub) => sub.subGroupId === subGroupId
      );
      return subGroup ? subGroup.subgroupAverage : null;
    }
    return null;
  };

  if (load || isLoadingQuestionsAverage) {
    return <div>Loading...</div>;
  }

  const stakeholderCount = 3;

  const collectCheckboxData = () => {
    return Object.entries(checkboxStates)
      .filter(([subGroupId, isChecked]) => isChecked)
      .map(([subGroupId, isChecked]) => ({
        SubGroupId: subGroupId,
        Value: isChecked ? 1 : 0,
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
            <th>wesentlich bewerten</th>
            <th>Gesamt Punkte</th>

            {[...Array(stakeholderCount)].map((_, index) => (
              <th key={index}>Stakeholder {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformedData.map((group) => (
            <React.Fragment key={group.groupId}>
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
                    <span
                      onClick={() => handleToggle(group.groupId)}
                      style={{ cursor: "pointer" }}
                    ></span>
                  </div>
                </td>
                <td>
                  <span>
                    <input
                      className="WesAn-checkbox"
                      type="checkbox"
                      checked={groupCheckboxStates[group.groupId] || false}
                      onChange={() => handleGroupCheckboxChange(group.groupId)}
                    />
                  </span>
                </td>
                <td>{getGroupAverage(group.groupId)}</td>

                {[...Array(stakeholderCount)].map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
              {visibleGroups[group.groupId] &&
                group.subGroups.map((subGroup) => (
                  <tr key={subGroup.subGroupId} className="title-green">
                    <td>
                      <div className="WesAn-group-container">
                        <span className="chkbox-title-container">
                          {subGroup.subGroupTitle}
                        </span>
                        <span>
                          {getSubGroupAverage(
                            group.groupId,
                            subGroup.subGroupId
                          )}
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
                    {[...Array(stakeholderCount)].map((_, index) => (
                      <td key={index}></td>
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
