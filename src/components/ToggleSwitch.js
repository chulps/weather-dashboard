// ToggleSwitch.js
import React from "react";
import "../css/toggle-switch.css";

const ToggleSwitch = ({
  isOn,
  handleToggle,
  label,
  onIcon,
  offIcon,
  className,
  tooltip,
}) => {
  return (
    <div className={`toggle-switch-container ${className}`} tooltip={tooltip}>
      <label>{label}</label>
      <div className="toggle-switch">
        <input
          checked={isOn}
          onChange={handleToggle}
          className="toggle-input"
          type="checkbox"
          id="toggle-switch"
        />
        <label className="toggle-label" htmlFor="toggle-switch">
          <span className="on-icon">{isOn ? onIcon : null}</span>
          <span className="toggle-button" />
          <span className="off-icon">{!isOn ? offIcon : null}</span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
