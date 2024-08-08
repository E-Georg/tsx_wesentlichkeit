import { useEffect, useState } from 'react';

import useSurveyQuestionAverageValues from '../Queries/useSurveyQuestionAverageValues';
import useStakeholderData from '../Queries/useStakeholderData';
import ModalComponent from '../WesAnModal/WesAnModal';
import GroupActionCheckbox from '../GroupActionCheckbox/GroupActionCheckbox';
import ModalStakeholderView from '../ModalStakeholderView/ModalStakeholderView';
import { Info } from '../Models/data.interfaces';

type Props = {};
export type checkedBox = {
  groupId: number;
  relevance: number;
};

const WesAnListSimple = (_: Props) => {
  const { SurveyQuestionAverageValues, isLoadingQuestionsAverage, updateRelevance } = useSurveyQuestionAverageValues();

  const { Stakeholder, isLoadingStake } = useStakeholderData();

  console.table(Stakeholder);

  const { SubStakeholderSurveyQuestionComments, isLoadingSubStakeholderComments } = useSurveyQuestionAverageValues();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ModalStakeholderViewIsOpen, setModalStakeholderView] = useState(false);

  const [currentComments, setCurrentComments] = useState([]);
  const [currentGroupTitle, setCurrentGroupTitle] = useState('');

  const [currentStakeholderModal, setCurrentStakeholderModal] = useState<Info | null>(null);

  const [state, setState] = useState<checkedBox[]>([]);

  useEffect(() => {
    if (!isLoadingQuestionsAverage && Array.isArray(SurveyQuestionAverageValues)) {
      const initialState = SurveyQuestionAverageValues.map((item) => ({
        groupId: item.groupId,
        relevance: item.groupRelevance,
      }));
      setState(initialState);
    }
  }, [isLoadingQuestionsAverage, SurveyQuestionAverageValues]);

  if (isLoadingQuestionsAverage || isLoadingStake || isLoadingSubStakeholderComments) {
    return <div className="loading">Loading...</div>;
  }

  const openModal = (groupTitle: string, groupId: number) => {
    const groupComment = SubStakeholderSurveyQuestionComments.find((group) => group.groupId === groupId);

    setCurrentComments(groupComment ? groupComment.Messages : []);
    setCurrentGroupTitle(groupTitle);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalStakeholderView(false);
  };

  const openStakeholderModal = (id: number) => {
    const currentStakeholderModal = Stakeholder!.find((stakeholder) => stakeholder.id === id);

    setCurrentStakeholderModal(currentStakeholderModal);

    setModalStakeholderView(true);
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

  const flattenedData = Array.isArray(SurveyQuestionAverageValues)
    ? SurveyQuestionAverageValues.map((group) => ({
        groupId: group.groupId,
        groupTitle: group.groupTitle,
        groupRelevance: group.groupRelevance,
        groupAverageTotal: group.groupAverageTotal,
        subgroupAverage:
          group.subGroups.reduce((acc, subGroup) => acc + subGroup.subgroupAverage, 0) / group.subGroups.length,
      }))
    : [];

  return (
    <div className="wes-an-matrix">
      <ModalStakeholderView isOpen={ModalStakeholderViewIsOpen} onClose={closeModal} info={currentStakeholderModal} />

      <table className="matrix-table">
        <thead>
          <tr>
            <th className="header-group-title">Group Title</th>
            <th className="header-group-comments">Stakeholderbefragung</th>
            <th className="header-group-chkbox">Wesentlich bewerten</th>
            <th className="header-group-average">Group Average</th>
            {Array.isArray(Stakeholder) &&
              Stakeholder.map((stakeholder) => (
                <th
                  className="header-stakeholder"
                  key={stakeholder.id}
                  onClick={() => openStakeholderModal(stakeholder.id)}
                >
                  {stakeholder.title}
                </th>
              ))}
          </tr>
        </thead>

        <tbody>
          {Array.isArray(flattenedData) &&
            flattenedData.map((group, index) => {
              const groupState = state[index];
              if (!groupState) return null;

              return (
                <tr key={group.groupId}>
                  <td className="group-title">{group.groupTitle}</td>
                  <td className="group-comments" onClick={() => openModal(group.groupTitle, group.groupId)}>
                    Einsicht
                  </td>
                  <td>
                    <GroupActionCheckbox
                      groupId={group.groupId}
                      state={groupState.relevance != null ? groupState.relevance : false}
                      setState={setState}
                    />
                  </td>
                  <td className="group-average">{group.groupAverageTotal}</td>
                  {Array.isArray(Stakeholder) &&
                    Stakeholder.map((stakeholder) => (
                      <td className="stakeholder-average" key={`${stakeholder.id}-${group.groupId}`}>
                        {(Array.isArray(SurveyQuestionAverageValues) &&
                          SurveyQuestionAverageValues.find((g) => g.groupId === group.groupId)?.subGroups.find(
                            (subGroup) => subGroup.stakeholderId === stakeholder.id
                          )?.subgroupAverage) ||
                          '-'}
                      </td>
                    ))}
                </tr>
              );
            })}
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
