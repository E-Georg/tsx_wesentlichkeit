import { useState } from 'react';
import './Survey.css';
import { Group, SurveyAnswer, SurveyQuestion } from '../Models/data.interfaces';
import { COLORS, Importance } from '../../utils/constants';
import { useStore } from '../../store';
import { useParams } from 'react-router-dom';
import { closeDescription, handleChangeInput, toggleDescription } from './SurveyFunctions';
import { AddSurveyQuestionAnswers } from '../../services/ApiService';

type Props = {
  SurveyQuestions: SurveyQuestion[];
  Group: Group | any;
};

const Survey = ({ SurveyQuestions, Group }: Props) => {
  const { subStakeholderId } = useParams();
  // const subStakeholderId = 2;
  const { surveyText, setSurveyText, ClientID, surveyAnswer, setSurveyAnswer, resetSurvey } = useStore();
  const [visibleDescription, setVisibleDescription] = useState<{ [key: number]: boolean }>({});

  const groupedQuestions = SurveyQuestions.reduce((acc: any, question: SurveyQuestion) => {
    if (!acc[question.groupId]) {
      acc[question.groupId] = [];
    }
    acc[question.groupId].push(question);
    return acc;
  }, {});

  const handleClick = async () => {
    await AddSurveyQuestionAnswers(Number(subStakeholderId), ClientID, surveyAnswer, surveyText);
    resetSurvey();
  };

  const handleChange = (subGroupId: number, answerValue: number) => {
    setSurveyAnswer((prevValues: SurveyAnswer[]) => {
      const existingIndex = prevValues.findIndex((item) => item.subGroupId === subGroupId);
      if (existingIndex > -1) {
        // Update the existing entry
        const updatedValues = [...prevValues];
        updatedValues[existingIndex] = { subGroupId, answer: answerValue };
        return updatedValues;
      } else {
        // Add a new entry
        return [...prevValues, { subGroupId, answer: answerValue }];
      }
    });
  };

  return (
    <div className="survey-container">
      <h1>Befragung</h1>
      {Group &&
        SurveyQuestions &&
        Array.isArray(SurveyQuestions) &&
        Array.isArray(Group) &&
        Object.keys(groupedQuestions).map((groupId) => {
          const group = Group.find((g) => g.id === parseInt(groupId));
          const questions = groupedQuestions[groupId];

          return (
            <div key={groupId} className="group-container">
              <h2 className="group-title">{group?.title}</h2>
              {questions.map((q: SurveyQuestion, index: number) => (
                <div key={index} className="question-box">
                  <div className="subgroup-container">
                    <p className="subgroup-title" onClick={() => console.log(q)}>
                      {q.subGroupTitle}

                      <button onClick={() => toggleDescription(setVisibleDescription, q.questions.id)} className="button1">
                        <img
                          src="/src/assets/info.svg"
                          style={{
                            width: '20px',
                            height: '20px',
                          }}
                          alt="Info"
                        />
                      </button>
                    </p>

                    <div className={`question-description ${visibleDescription[q.questions.id] ? 'show' : ''}`}>
                      <span className="close-button" onClick={() => closeDescription(setVisibleDescription, q.questions.id)}>
                        ×
                      </span>
                      {q.questions.id}
                    </div>
                  </div>
                  <p>{q.questions.value}</p>
                  <div className="radio-container">
                    <div className="radio-labels">
                      {Importance.map((imp) => (
                        <span key={imp.answer} className="radio-label">
                          {imp.answer}
                        </span>
                      ))}
                    </div>
                    <div className="radio-inputs">
                      {Importance.map((imp) => (
                        <label key={imp.answer} className="radio-input">
                          <input type="radio" name={`question-${q.subGroupId}`} value={imp.answer} onChange={() => handleChange(q.subGroupId, imp.answer)} />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <textarea
                onChange={(event) => handleChangeInput(setSurveyText, Number(subStakeholderId), event, Number(group.id))}
                style={{ width: '100%', height: '5rem' }}
              />
            </div>
          );
        })}
      <button onClick={() => handleClick()} style={{ width: '100%', backgroundColor: COLORS.TERTIARY }}>
        Senden
      </button>
    </div>
  );
};

export default Survey;
