import React from "react";
import "./Square.css";

const Square = ({ value, onClick, item, cssClass, key, i }) => {
  const handleClick = () => {
    if (value.counter !== null) {
      onClick();
    }
  };


  const boxArray = [
    `/images/NumBox/box-1.png`,
    `/images/NumBox/box-2.png`,
    `/images/NumBox/box-3.png`,
    `/images/NumBox/box-4.png`,
    `/images/NumBox/box-5.png`,
    `/images/NumBox/box-6.png`,
    `/images/NumBox/box-7.png`,
    `/images/NumBox/box-8.png`,
    `/images/NumBox/box-9.png`,
    `/images/NumBox/box-10.png`
  ]

  const boxTextColor = [
    '#b8a200',
    '#e06500',
    '#e00b00',
    '#e0006d',
    '#991f8f',
    '#701f99',
    '#231f99',
    '#1362bd',
    '#10a337',
    '#6ba310',
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
          <div style={{color:`${boxTextColor[i > 9 ? (i % 10) : i]}`}} className='counter'>
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
