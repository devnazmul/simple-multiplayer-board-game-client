import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import "./Board.css";

const Board = ({ boxes, currentPlayer, onBoxClick }) => {
  const renderBox = (box, index) => {
    const isPlayer1 = box.player === "player1";
    const isPlayer2 = box.player === "player2";
    const isCurrentPlayer = currentPlayer === box.player;

    return (
      <div key={index} className={classNames("box", { player1: isPlayer1, player2: isPlayer2, })} onClick={() => onBoxClick(index)} >
        <span>{box.number}</span>
        {isCurrentPlayer && <div className='number'>{index + 1}</div>}
      </div>
    );
  };

  return <div className='board'>{[boxes]?.map(renderBox)}</div>;
};

Board.propTypes = {
  boxes: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      player: PropTypes.oneOf(["", "player1", "player2"]).isRequired,
    })
  ).isRequired,
  currentPlayer: PropTypes.oneOf(["player1", "player2"]).isRequired,
  onBoxClick: PropTypes.func.isRequired,
};

export default Board;
