import React, { useState } from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import useStakeholderData from "../Queries/useStakeholderData";
import ModalComponent from "../WesAnModal/WesAnModal";
import GroupActionCheckbox from "../GroupActionCheckbox/GroupActionCheckbox";

type Props = {};

const WesAnListSimple = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage } =
    useSurveyQuestionAverageValues();
  const { Stakeholder, isStakeholderLoading } = useStakeholderData();
  const {
    SubStakeholderSurveyQuestionComments,
    isLoadingSubStakeholderComments,
  } = useSurveyQuestionAverageValues();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [currentGroupTitle, setCurrentGroupTitle] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>(
    {}
  );

  if (load || isLoadingQuestionsAverage || isStakeholderLoading) {
    return <div className="loading">Loading...</div>;
  }

  const stakeholderMap = Array.isArray(Stakeholder)
    ? Stakeholder.reduce((acc, stakeholder) => {
        acc[stakeholder.id] = stakeholder.title;
        return acc;
      }, {} as Record<number, string>)
    : [];
  console.clear();
  console.table(SurveyQuestionAverageValues);

  const flattenedData = SurveyQuestionAverageValues.map((group) => ({
    groupId: group.groupId,
    groupTitle: group.groupTitle,
    groupRelevance: group.groupRelevance,
    groupAverageTotal: group.groupAverageTotal,
    subgroupAverage:
      group.subGroups.reduce(
        (acc, subGroup) => acc + subGroup.subgroupAverage,
        0
      ) / group.subGroups.length,
  }));

  const openModal = (groupTitle, groupId) => {
    const groupComment = SubStakeholderSurveyQuestionComments.find(
      (group) => group.groupId === groupId
    );

    setCurrentComments(groupComment ? groupComment.Messages : []);
    setCurrentGroupTitle(groupTitle);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCheckboxChange = (groupId: number, isChecked: boolean) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [groupId]: isChecked,
    }));
  };

  const handleSendClick = () => {
    const dataToSend = Object.entries(selectedGroups)
      .filter(([_, isChecked]) => isChecked)
      .map(([groupId]) => ({
        groupId: Number(groupId),
        value: 1,
      }));

    console.log(dataToSend);
  };

  return (
    <div className="wes-an-matrix">
      <table className="matrix-table">
        <thead>
          <tr>
            <th className="header-group-title">Group Title</th>
            <th className="header-group-comments">Stakeholderbefragung </th>
            <th className="header-group-chkbox">Wesentlich bewerten </th>
            <th className="header-group-average">Group Average</th>
            {Array.isArray(Stakeholder) &&
              Stakeholder.map((stakeholder) => (
                <th className="header-stakeholder" key={stakeholder.id}>
                  {stakeholder.title}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(flattenedData) &&
            flattenedData.map((group) => (
              <tr key={group.groupId}>
                <td className="group-title">{group.groupTitle}</td>
                <td
                  className="group-comments"
                  onClick={() => openModal(group.groupTitle, group.groupId)}
                >
                  Einsicht
                </td>
                <td>
                  <GroupActionCheckbox
                    groupId={group.groupId}
                    onChange={handleCheckboxChange}
                    groupRelevance={group.groupRelevance}
                  />
                </td>
                <td className="group-average">{group.groupAverageTotal}</td>
                {Stakeholder.map((stakeholder) => (
                  <td
                    className="stakeholder-average"
                    key={`${stakeholder.id}-${group.groupId}`}
                  >
                    {SurveyQuestionAverageValues.find(
                      (g) => g.groupId === group.groupId
                    )?.subGroups.find(
                      (subGroup) => subGroup.stakeholderId === stakeholder.id
                    )?.subgroupAverage || "-"}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={handleSendClick} className="send-button">
        Send Data
      </button>

      <ModalComponent
        isOpen={modalIsOpen}
        onClose={closeModal}
        groupTitle={currentGroupTitle}
        comments={currentComments}
      />
    </div>
  );
};

export default WesAnListSimple;
