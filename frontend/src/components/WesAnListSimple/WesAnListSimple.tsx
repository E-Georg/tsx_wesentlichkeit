import { useEffect, useState } from "react";

import useSurveyQuestionAverageValues from "../Queries/useSurveyQuestionAverageValues";
import useStakeholderData from "../Queries/useStakeholderData";
import ModalComponent from "../WesAnModal/WesAnModal";
import GroupActionCheckbox from "../GroupActionCheckbox/GroupActionCheckbox";

type Props = {};
export type checkedBox = {
  groupId: number;
  relevance: number;
};

const WesAnListSimple = (_: Props) => {
  const {
    SurveyQuestionAverageValues,
    isLoadingQuestionsAverage,
    updateRelevance,
  } = useSurveyQuestionAverageValues();
  const { Stakeholder, isLoadingStake } = useStakeholderData();
  const {
    SubStakeholderSurveyQuestionComments,
    isLoadingSubStakeholderComments,
  } = useSurveyQuestionAverageValues();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [currentGroupTitle, setCurrentGroupTitle] = useState("");

  const [state, setState] = useState<checkedBox[]>([]);

  if (
    isLoadingQuestionsAverage ||
    isLoadingStake ||
    isLoadingSubStakeholderComments
  ) {
    <div className="loading">Loading...</div>;
  }

  // const stakeholderMap = Array.isArray(Stakeholder)
  //   ? Stakeholder.reduce((acc, stakeholder) => {
  //       acc[stakeholder.id] = stakeholder.title;
  //       return acc;
  //     }, {} as Record<number, string>)
  //   : [];

  console.clear();
  console.table(SurveyQuestionAverageValues);

  const flattenedData =
    Array.isArray(SurveyQuestionAverageValues) &&
    SurveyQuestionAverageValues.map((group) => ({
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

  const handleSendClick = async () => {
    try {
      await updateRelevance(state);

      alert("Relevance updated successfully.");
    } catch (error) {
      console.error("Error updating relevance:", error);
      alert("An error occurred while updating relevance.");
    }
  };

  const handleCheckboxChange = (groupId: number, isChecked: boolean) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [groupId]: isChecked,
    }));
  };

  // const handleSendClick = async () => {
  //   const clientId = 2;

  //   const dataToSend = Object.entries(selectedGroups).map(
  //     ([groupId, isChecked]) => ({
  //       clientId,
  //       relevance: isChecked ? 1 : 0,
  //       clientGroupId: Number(groupId),
  //     })
  //   );

  //   console.log(selectedGroups);

  // try {
  //   for (const data of dataToSend) {
  //     const result = await UpdateRelevanceGroup(
  //       data.clientId,
  //       data.relevance,
  //       data.clientGroupId
  //     );
  //     console.log("Update result:", result);
  //   }
  //   alert("Relevance updated successfully.");
  // } catch (error) {
  //   console.error("Error updating relevance:", error);
  //   alert("An error occurred while updating relevance.");
  // }
  // };

  // const fillChecked = (groupId: number, relevance: number) => {
  //   setIsChecked([...isChecked, { id: groupId, checked: relevance }]);
  // };

  // useEffect(() => {
  //   Array.isArray(flattenedData) &&
  //     flattenedData.map((item) =>
  //       fillChecked(item.groupId, item.groupRelevance)
  //     );
  // }, []);

  useEffect(() => {
    if (
      !isLoadingQuestionsAverage &&
      Array.isArray(SurveyQuestionAverageValues)
    ) {
      const initialState = SurveyQuestionAverageValues.map((item) => ({
        groupId: item.groupId,
        relevance: item.groupRelevance,
      }));
      setState(initialState);
    }
  }, [isLoadingQuestionsAverage, SurveyQuestionAverageValues]);

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
            flattenedData.map((group, index) => {
              const groupState = state[index];
              if (!groupState) return null;

              return (
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
                      state={
                        groupState.relevance != null
                          ? groupState.relevance
                          : false
                      }
                      setState={setState}
                    />
                  </td>
                  <td className="group-average">{group.groupAverageTotal}</td>
                  {Array.isArray(Stakeholder) &&
                    Stakeholder.map((stakeholder) => (
                      <td
                        className="stakeholder-average"
                        key={`${stakeholder.id}-${group.groupId}`}
                      >
                        {(Array.isArray(SurveyQuestionAverageValues) &&
                          SurveyQuestionAverageValues.find(
                            (g) => g.groupId === group.groupId
                          )?.subGroups.find(
                            (subGroup) =>
                              subGroup.stakeholderId === stakeholder.id
                          )?.subgroupAverage) ||
                          "-"}
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
