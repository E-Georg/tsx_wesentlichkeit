import { Importance } from '../../utils/constants';
import { SurveyQuestion } from '../Models/data.interfaces';
import { closeDescription, handleChange, toggleDescription } from './SurveyQuestionListFuntions';
import './SurveyQuestionList.scss';

const SurveyQuestionList = ({ setVisibleDescription, questions, visibleDescription, setSurveyAnswer }: any) => {
  return (
    <div>
      {questions.map((q: SurveyQuestion, index: number) => (
        <div key={index} className="question-box">
          <div className="subgroup-container">
            <p className="subgroup-title" onClick={() => console.log(q)}>
              {q.subGroupTitle}

              <button onClick={() => toggleDescription(setVisibleDescription, q.questions.id)} className="button1">
                <img src="/src/assets/info.svg" alt="Info" />
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
                  <input
                    type="radio"
                    name={`question-${q.subGroupId}`}
                    value={imp.answer}
                    onChange={() => handleChange(setSurveyAnswer, q.subGroupId, imp.answer)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveyQuestionList;
