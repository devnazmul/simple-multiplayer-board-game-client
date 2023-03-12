import React, { useState } from "react";
import "./RollDiceButton.css";

const RollDiceButton = ({ onRoll }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(null);

  const handleRollClick = () => {
    setIsRolling(true);
    setTimeout(() => {
      const rolledValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolledValue);
      setIsRolling(false);
      onRoll(rolledValue);
    }, 1000);
  };

  return (
    <button
      className={`roll-dice-button ${isRolling ? "rolling" : ""}`}
      onClick={handleRollClick}
    >
      <span className='dice'>{diceValue ? diceValue : "&#9856;"}</span>
      {diceValue ? `You rolled a ${diceValue}!` : "Roll Dice"}
    </button>
  );
};

export default RollDiceButton;
