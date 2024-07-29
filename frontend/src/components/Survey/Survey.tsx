import { useState } from 'react';
import './Survey.css';
import { Question } from '../Models/data.interfaces';
import { Importance } from '../../utils/constants';

const Survey = ({ SurveyQuestions, Group }: any) => {
  // Initialize state to store selected values and toggle description
  const [selectedValues, setSelectedValues] = useState<{ questionId: number; value: number }[]>([]);
  const [visibleDescription, setVisibleDescription] = useState<{ [key: number]: boolean }>({});

  // Group questions by groupId
  const groupedQuestions = SurveyQuestions.reduce((acc: any, question: any) => {
    if (!acc[question.groupId]) {
      acc[question.groupId] = [];
    }
    acc[question.groupId].push(question);
    return acc;
  }, {});

  // Handle radio button change
  const handleChange = (questionId: number, value: number) => {
    setSelectedValues((prevValues) => {
      const existingIndex = prevValues.findIndex((item) => item.questionId === questionId);
      if (existingIndex > -1) {
        const updatedValues = [...prevValues];
        updatedValues[existingIndex] = { questionId, value };
        return updatedValues;
      } else {
        return [...prevValues, { questionId, value }];
      }
    });

    console.log(selectedValues);
  };

  // Toggle the visibility of the description
  const toggleDescription = (questionId: number) => {
    setVisibleDescription((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  // Close the description box
  const closeDescription = (questionId: number) => {
    setVisibleDescription((prevState) => ({
      ...prevState,
      [questionId]: false,
    }));
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
              {questions.map((q: Question, index: number) => (
                <div key={index} className="question-box">
                  <div className="subgroup-container">
                    <p className="subgroup-title">
                      {q.subGroupTitle}

                      <button
                        onClick={() => toggleDescription(q.questionId)}
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
                    <div className={`question-description ${visibleDescription[q.questionId] ? 'show' : ''}`}>
                      <span className="close-button" onClick={() => closeDescription(q.questionId)}>
                        ×
                      </span>
                      {q.questionDescription}
                    </div>
                  </div>
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
                            name={`question-${q.questionId}`}
                            value={imp.value}
                            checked={selectedValues.find((item) => item.questionId === q.questionId)?.value === imp.value}
                            onChange={() => handleChange(q.questionId, imp.value)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
};

export default Survey;
