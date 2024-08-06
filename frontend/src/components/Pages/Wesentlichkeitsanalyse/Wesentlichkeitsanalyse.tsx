import React, { useState } from "react";
import "./Wesentlichkeitsanalyse.scss";
import WesAnMatrixDetailed from "../../WesAnMatrix/WesAnMatrixDetailed";
import WesAnListSimple from "../../WesAnListSimple/WesAnListSimple";

const Wesentlichkeitsanalyse = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [<WesAnListSimple />, <WesAnMatrixDetailed />];

  const slideTitles = ["Einfache Ansicht", "Detaillierte Ansicht"];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="wesentlichkeitsanalyse-container">
      <div className="slider-container">
        <div className="slider-buttons">
          <button className="slider-button" onClick={handlePrev}>
            ❮
          </button>
          <button className="slider-button" onClick={handleNext}>
            ❯
          </button>
          <div className="slider-text">{slideTitles[currentSlide]}</div>
        </div>
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="table-container">{/* Deine Tabelle hier */}</div>
    </div>
  );
};

export default Wesentlichkeitsanalyse;
