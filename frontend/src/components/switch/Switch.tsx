import React from "react";
import "./Switch.scss";

const Switch = ({ isOn, handleToggle, onColor, labelLeft, labelRight }) => {
  return (
    <div className="switch-wrapper">
      <span className="switch-label-text">{labelLeft}</span>
      <div className="switch-container">
        <input
          checked={isOn}
          onChange={handleToggle}
          className="switch-checkbox"
          id={`react-switch-new`}
          type="checkbox"
        />
        <label
          style={{ background: isOn && onColor }}
          className="switch-label"
          htmlFor={`react-switch-new`}
        >
          <span className={`switch-button`} />
        </label>
      </div>
      <span className="switch-label-text">{labelRight}</span>
    </div>
  );
};

export default Switch;
