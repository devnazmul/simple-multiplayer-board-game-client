import React from "react";
import { BiLock } from "react-icons/bi";
import "./Square.css";

const Square = ({ value, onClick, disabled, item, cssClass }) => {
  const handleClick = () => {
    if (value.counter !== null) {
      onClick();
    }
  };

  // console.log("Square value:", value); // add console log to check value

  return (
    <button
      disabled={disabled}
      className={`square ${cssClass}`}
      onClick={handleClick}
    >
      {value.counter !== null ? (
        <>
          <div className='counter'>
            {item?.alreadyPlayed ? <BiLock style={{ color: "red" }} /> : value}
          </div>
          {console.log(item?.alreadyPlayed)}
          {value.questionVisible && (
            <div className='question'>
              <div className='question-text'>
                {value.operand1} {value.operator} {value.operand2} =
              </div>
              <input type='number' className='answer-input' />
              <button className='submit-button' onClick={value.onSubmit}>
                Submit
              </button>
            </div>
          )}
          {value.answerVisible && (
            <div className='answer'>
              {value.correctAnswer ? "Correct!" : "Wrong!"} The answer is{" "}
              {value.answer}.
            </div>
          )}
        </>
      ) : (
        <div className='empty-square' />
      )}
    </button>
  );
};

export default Square;
