import React, { useEffect, useState } from 'react';
import useGroupSubGroupData from '../Queries/useGroupSubGroup';
import useSurveyQuestionAverageValues from '../Queries/useSurveyQuestionAverageValues';
import useStakeholderData from '../Queries/useStakeholderData';
import ModalComponent from '../WesAnModal/WesAnModal';
import './WesAnMatrix.scss';
import GroupActionCheckbox from '../GroupActionCheckbox/GroupActionCheckbox';
import ModalStakeholderView from '../ModalStakeholderView/ModalStakeholderView';

type Props = {};
export type checkedBox = {
  groupId: number;
  relevance: number;
};

const WesAnMatrixDetailed = (_: Props) => {
  const { GroupSubGroup, isLoading: load } = useGroupSubGroupData();
  const {
    SurveyQuestionAverageValues,
    isLoadingQuestionsAverage,
    SubStakeholderSurveyQuestionComments,
    isLoadingSubStakeholderComments,
    updateRelevance,
  } = useSurveyQuestionAverageValues();
  const { Stakeholder, isStakeholderLoading } = useStakeholderData();
  const [selectedGroups, setSelectedGroups] = useState<Record<number, boolean>>({});
  const [state, setState] = useState<checkedBox[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    groupTitle: string;
    comments: Array<{ SubStakeholderName: string; text: string }>;
  }>({ groupTitle: '', comments: [] });

  useEffect(() => {
    if (!isLoadingQuestionsAverage && Array.isArray(SurveyQuestionAverageValues)) {
      const initialState = SurveyQuestionAverageValues.map((item) => ({
        groupId: item.groupId,
        relevance: item.groupRelevance,
      }));
      setState(initialState);
    }
  }, [isLoadingQuestionsAverage, SurveyQuestionAverageValues]);

  if (load || isLoadingQuestionsAverage || isStakeholderLoading || isLoadingSubStakeholderComments) {
    return <div className="loading">Loading...</div>;
  }

  const stakeholderMap = Stakeholder.reduce(
    (acc, stakeholder) => {
      acc[stakeholder.id] = stakeholder.title;
      return acc;
    },
    {} as Record<number, string>
  );

  const filteredSubGroupData = SurveyQuestionAverageValues.map((group) => ({
    groupId: group.groupId,
    groupTitle: group.groupTitle,
    groupRelevance: group.groupRelevance,
    groupAverageTotal: group.groupAverageTotal,
    subGroups: group.subGroups,
  }));

  const getGroupMessages = (groupId: number) => {
    const group = SubStakeholderSurveyQuestionComments.find((g) => g.groupId === groupId);
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

  const handleSendClick = async () => {
    try {
      await updateRelevance(state);
      alert('Relevance updated successfully.');
    } catch (error) {
      console.error('Error updating relevance:', error);
      alert('An error occurred while updating relevance.');
    }
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
          {filteredSubGroupData.map((group, index) => {
            const groupState = state[index];
            if (!groupState) return null;

            return (
              <React.Fragment key={group.groupId}>
                <tr>
                  <td className="group-title" rowSpan={group.subGroups.length}>
                    {group.groupTitle}
                  </td>
                  <td
                    className="group-comments"
                    rowSpan={group.subGroups.length}
                    onClick={() => handleOpenModal(group.groupTitle, group.groupId)}
                  >
                    Einsicht
                  </td>
                  <td className="group-checkbox" rowSpan={group.subGroups.length}>
                    <GroupActionCheckbox
                      groupId={group.groupId}
                      state={groupState.relevance != null ? groupState.relevance : false}
                      setState={setState}
                    />
                  </td>
                  <td className="group-average" rowSpan={group.subGroups.length}>
                    {group.groupAverageTotal}
                  </td>
                  <td className="subgroup-title">{group.subGroups[0]?.subGroupTitle}</td>
                  <td className="subgroup-average">{group.subGroups[0]?.subgroupAverage}</td>
                  {Stakeholder.map((stakeholder) => (
                    <td className="stakeholder-average" key={`${stakeholder.id}-${group.groupId}`}>
                      {group.subGroups.find((subGroup) => subGroup.stakeholderId === stakeholder.id)?.subgroupAverage ||
                        '-'}
                    </td>
                  ))}
                </tr>
                {group.subGroups.slice(1).map((subGroup) => (
                  <tr key={`${subGroup.subGroupId}-${group.groupId}-${subGroup.stakeholderId}`}>
                    <td className="subgroup-title">{subGroup.subGroupTitle}</td>
                    <td className="subgroup-average">{subGroup.subgroupAverage}</td>
                    {Stakeholder.map((stakeholder) => (
                      <td className="stakeholder-average" key={`${stakeholder.id}-${subGroup.subGroupId}`}>
                        {subGroup.stakeholderId === stakeholder.id ? subGroup.subgroupAverage : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
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
