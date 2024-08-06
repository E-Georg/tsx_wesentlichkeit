import React, { useState } from "react";
import "./Wesentlichkeitsanalyse.scss";
import WesAnMatrixDetailed from "../../WesAnMatrix/WesAnMatrixDetailed";
import WesAnListSimple from "../../WesAnListSimple/WesAnListSimple";
import Switch from "../../switch/Switch";

const Wesentlichkeitsanalyse = () => {
  const [currentView, setCurrentView] = useState(0);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const views = [
    { component: <WesAnListSimple />, title: "Einfache Ansicht" },
    { component: <WesAnMatrixDetailed />, title: "Detaillierte Ansicht" },
  ];

  const handleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    setCurrentView(isSwitchOn ? 0 : 1); // Toggle between views
  };

  return (
    <div className="wesentlichkeitsanalyse-container">
      <div className="switch-container">
        <Switch
          isOn={isSwitchOn}
          handleToggle={handleSwitch}
          onColor="#06D6A0"
          labelLeft="Einfache Ansicht"
          labelRight="Detaillierte Ansicht"
        />
      </div>
      <div className="switch-content">{views[currentView].component}</div>
      <div className="table-container">{/* Deine Tabelle hier */}</div>
    </div>
  );
};

export default Wesentlichkeitsanalyse;
