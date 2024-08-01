import { useState } from 'react';
import './Survey.css';
import { Group, SurveyQuestion } from '../Models/data.interfaces';
import { useStore } from '../../store';
import { handleChangeInput } from './SurveyFunctions';
import SurveyQuestionList from '../SurveyQuestionList/SurveyQuestionList';

type Props = {
  SurveyQuestions: SurveyQuestion[];
  Group: Group | any;
};

const Survey = ({ SurveyQuestions, Group }: Props) => {
  //const { subStakeholderId } = useParams();
  const subStakeholderId = 2;
  const { setSurveyText, setSurveyAnswer } = useStore();
  const [visibleDescription, setVisibleDescription] = useState<{ [key: number]: boolean }>({});

  const groupedQuestions = Array.isArray(SurveyQuestions)
    ? SurveyQuestions.reduce((acc: any, question: SurveyQuestion) => {
        if (!acc[question.groupId]) {
          acc[question.groupId] = [];
        }
        acc[question.groupId].push(question);
        return acc;
      }, {})
    : [];

  return (
    <div className="survey-container">
      <h1>Befragung</h1>
      {Group &&
        Array.isArray(Group) &&
        Object.keys(groupedQuestions).map((groupId) => {
          const group = Group.find((g) => g.id === parseInt(groupId));
          const questions = groupedQuestions[groupId];

          return (
            <div key={groupId} className="group-container">
              <h2 className="group-title">{group?.title}</h2>
              <SurveyQuestionList
                setVisibleDescription={setVisibleDescription}
                questions={questions}
                visibleDescription={visibleDescription}
                setSurveyAnswer={setSurveyAnswer}
              />

              <textarea
                onChange={(event) => handleChangeInput(setSurveyText, Number(subStakeholderId), event, Number(group.id))}
                style={{ width: '100%', height: '5rem' }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default Survey;
