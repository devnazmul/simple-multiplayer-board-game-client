import React from "react";
import { BiLock } from "react-icons/bi";
import "./Square.css";

const Square = ({ value, onClick, item, cssClass }) => {
  const handleClick = () => {
    if (value.counter !== null) {
      onClick();
    }
  };


  return (
    <button
      disabled={item?.alreadyPlayed}
      className={`square ${cssClass}`}
      onClick={handleClick}
    >
      {value.counter !== null ? (
        <>
          <div className='counter'>
            {item?.alreadyPlayed ? <BiLock style={{ color: "red" }} /> : value}
          </div>
        </>
      ) : (
        <div className='empty-square' />
      )}
    </button>
  );
};

export default Square;
