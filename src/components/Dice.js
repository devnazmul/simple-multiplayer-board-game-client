import React from "react";
import "./Dice.css";

const Dice = ({ number, rolling }) => {
  return (
    <div className='dice-container'>
      <div className={`dice ${rolling ? "rolling" : ""}`}>
        <span className={`dice-face dice-${number}`}></span>
      </div>
    </div>
  );
};

export default Dice;
