import { useState } from 'react';
import './Survey.css';
import { Group, SurveyAnswer, SurveyQuestion } from '../Models/data.interfaces';
import { COLORS, Importance } from '../../utils/constants';
import { useStore } from '../../store';
import { useParams } from 'react-router-dom';
import { closeDescription, handleChange, handleChangeInput, toggleDescription } from './SurveyFunctions';
import { AddSurveyQuestionAnswers } from '../../services/ApiService';

type Props = {
  SurveyQuestions: SurveyQuestion[];
  Group: Group | any;
};

const Survey = ({ SurveyQuestions, Group }: Props) => {
  const { subStakeholderId } = useParams();
  const { surveyText, setSurveyText, ClientID } = useStore();
  const [selectedValues, setSelectedValues] = useState<SurveyAnswer[]>([]);
  const [visibleDescription, setVisibleDescription] = useState<{ [key: number]: boolean }>({});

  const groupedQuestions = SurveyQuestions.reduce((acc: any, question: SurveyQuestion) => {
    if (!acc[question.groupId]) {
      acc[question.groupId] = [];
    }
    acc[question.groupId].push(question);
    return acc;
  }, {});

  const handleClick = async (groupId: number) => {
    // subStakeholderID: number,
    //clientId: number,
    // groupId: number,
    // message: SurveyAnswer[],
    // comment: string

    /// BUTTON PRESSED AFTER ALL GROUPS ARE DONE, NEED TO BE SAVED BEFORE!
    // TODO: NOT WORKING
    await AddSurveyQuestionAnswers(
      Number(subStakeholderId),
      ClientID,
      groupId,
      selectedValues,
      surveyText.find((item) => item.SubStakeholderId === Number(subStakeholderId) && item.groupId === groupId)?.text!!
    );
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
                <>
                  <div key={index} className="question-box">
                    <div className="subgroup-container">
                      <p className="subgroup-title">
                        {q.subGroupTitle}

                        <button
                          onClick={() => toggleDescription(setVisibleDescription, q.questions.id)}
                          style={{
                            marginLeft: '1rem',
                            border: 'none',
                            background: 'white',
                            cursor: 'pointer',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '50%',
                            outline: 'none',
                          }}
                        >
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
                          <span key={imp.value} className="radio-label">
                            {imp.value}
                          </span>
                        ))}
                      </div>
                      <div className="radio-inputs">
                        {Importance.map((imp) => (
                          <label key={imp.value} className="radio-input">
                            <input
                              type="radio"
                              name={`question-${q.questions.id}`}
                              value={imp.value}
                              checked={selectedValues.find((item) => item.subGroupId === q.subGroupId)?.answers === imp.value}
                              onChange={() => handleChange(setSelectedValues, q.subGroupId, imp.value)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <textarea
                onChange={(event) => handleChangeInput(setSurveyText, Number(subStakeholderId), event, Number(group.id))}
                style={{ width: '100%', height: '5rem' }}
              />
            </div>
          );
        })}
      <button onClick={() => handleClick(1)} style={{ width: '100%', backgroundColor: COLORS.TERTIARY }}>
        Senden
      </button>
    </div>
  );
};

export default Survey;
