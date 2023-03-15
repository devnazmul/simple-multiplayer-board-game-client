import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Board from "./Board";
import Dice from "./Dice";

const Game = ({ playerName, boardSize, gameId, socket }) => {
  const history = useHistory();
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.emit("join-game", { gameId, playerName });
    socket.on("game-start", ({ isMyTurn }) => {
      setIsMyTurn(isMyTurn);
    });
    socket.on("roll-dice", ({ isMyTurn }) => {
      setIsMyTurn(isMyTurn);
    });
    socket.on("score-update", ({ myScore, opponentScore, isMyTurn }) => {
      setMyScore(myScore);
      setOpponentScore(opponentScore);
      setIsMyTurn(isMyTurn);
    });
    socket.on("game-over", ({ myScore, opponentScore }) => {
      setMyScore(myScore);
      setOpponentScore(opponentScore);
      setGameOver(true);
    });
    socket.on("game-leave", () => {
      alert("Opponent has left the game");
      history.push("/");
    });

    return () => {
      socket.emit("leave-game", { gameId });
      socket.off("game-start");
      socket.off("roll-dice");
      socket.off("score-update");
      socket.off("game-over");
      socket.off("game-leave");
    };
  }, [gameId, playerName, socket, history]);

  const handleRollDice = (diceValue) => {
    socket.emit("roll-dice", { gameId, diceValue, playerName });
  };

  return (
    <div className='game-container'>
      <div className='board-container'>
        <Board boardSize={boardSize} isMyTurn={isMyTurn} socket={socket} />
      </div>
      <div className='score-container'>
        <h3>{playerName}</h3>
        <p>My Score: {myScore}</p>
        <p>Opponent Score: {opponentScore}</p>
        {gameOver && (
          <div className='game-over'>
            <h2>Game Over</h2>
            {myScore > opponentScore ? (
              <h3>Congratulations! You Won</h3>
            ) : (
              <h3>Opponent Won</h3>
            )}
            <button onClick={() => history.push("/")}>Back to Home</button>
          </div>
        )}
      </div>
      <div className='dice-container'>
        <Dice isMyTurn={isMyTurn} handleRollDice={handleRollDice} />
      </div>
    </div>
  );
};

export default Game;
