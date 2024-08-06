import React, { useState } from "react";
import useGroupSubGroupData from "../Queries/useGroupSubGroup";
import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import useStakeholderData from "../Queries/useStakeholderData";
import ModalComponent from "../WesAnModal/WesAnModal";
import "./WesAnMatrix.scss";
import GroupActionCheckbox from "../GroupActionCheckbox/GroupActionCheckbox";

type Props = {};

const WesAnMatrixDetailed = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const {
    SurveyQuestionAverageValues,
    isLoadingQuestionsAverage,
    SubStakeholderSurveyQuestionComments,
    isLoadingSubStakeholderComments,
  } = useSurveyQuestionAverageValues();
  const { Stakeholder, isStakeholderLoading } = useStakeholderData();
  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>(
    {}
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    groupTitle: string;
    comments: Array<{ SubStakeholderName: string; text: string }>;
  }>({ groupTitle: "", comments: [] });

  if (
    load ||
    isLoadingQuestionsAverage ||
    isStakeholderLoading ||
    isLoadingSubStakeholderComments
  ) {
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

  const getGroupMessages = (groupId: number) => {
    const group = SubStakeholderSurveyQuestionComments.find(
      (g) => g.groupId === groupId
    );
    return group ? group.Messages : [];
  };

  const handleOpenModal = (groupTitle: string, groupId: number) => {
    const comments = getGroupMessages(groupId);
    setModalData({ groupTitle, comments });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                <td
                  className="group-comments"
                  rowSpan={group.subGroups.length}
                  onClick={() =>
                    handleOpenModal(group.groupTitle, group.groupId)
                  }
                >
                  Einsicht
                </td>
                <td className="group-checkbox" rowSpan={group.subGroups.length}>
                  <GroupActionCheckbox
                    groupId={group.groupId}
                    onChange={handleCheckboxChange}
                  />
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
      <button onClick={handleSendClick} className="send-button">
        Send Data
      </button>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        groupTitle={modalData.groupTitle}
        comments={modalData.comments}
      />
    </div>
  );
};

export default WesAnMatrixDetailed;
