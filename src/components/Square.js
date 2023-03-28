import React from "react";
import "./Square.css";

const Square = ({ value, onClick, item, cssClass, key,i }) => {
  const handleClick = () => {
    if (value.counter !== null) {
      onClick();
    }
  };


  const boxArray = [
    `/images/boxes/box-1.png`,
    `/images/boxes/box-2.png`,
    `/images/boxes/box-3.png`,
    `/images/boxes/box-4.png`,
    `/images/boxes/box-5.png`,
    `/images/boxes/box-6.png`,
    `/images/boxes/box-7.png`,
    `/images/boxes/box-8.png`,
    `/images/boxes/box-9.png`,
    `/images/boxes/box-10.png`
  ]

  return (
    <button
      disabled={item?.alreadyPlayed}
      className={`square`}
      style={{
        backgroundImage: `url(${boxArray[i > 9 ? (i % 10) : i]})`
      }}
      onClick={handleClick}
    >
      {value.counter !== null ? (
        <>
          <div className='counter'>
            {(item?.alreadyPlayed) ? <img className="lock" src="/images/lock.png" alt="lock" /> : value + 1}
          </div>
        </>
      ) : (
        <div className='empty-square' />
      )}
    </button>
  );
};

export default Square;
