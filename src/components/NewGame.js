import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import socket from "../socket";
import "./NewGame.css";

const NewGameForm = () => {
  const [playerName, setPlayerName] = useState("");
  const [boardSize, setBoardSize] = useState(50);
  const [numPlayers, setNumPlayers] = useState(2);
  const [numTurns, setNumTurns] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameDetails, setGameDetails] = useState(null);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName) {
      setErrorMessage("Player name is required.");
      return;
    }

    if (!boardSize) {
      setErrorMessage("Board size is required.");
      return;
    }

    if (!numPlayers) {
      setErrorMessage("Number of players is required.");
      return;
    }

    if (!numTurns) {
      setErrorMessage("Number of turns is required.");
      return;
    } else if (/^\d/.test(playerName)) {
      setErrorMessage("Player name should not start with a digit");
      return;
    }

    setErrorMessage("");
    socket.emit("create_game", {
      playerName,
      boardSize,
      numPlayers,
      numTurns,
    });
  };

  socket.on("game_creation_success", (game) => {
    setGameDetails(game.gameDetails);

    history.push(
      `/game-board/${game.gameDetails.gameId}/${game.gameDetails.numPlayers}/${game.gameDetails.boardSize}?playerName=${game.gameDetails.playerName}`
    );
    // }
  });

  socket.on("game_creation_failed", (error) => {
    setGameDetails(null);
    setErrorMessage(error);
  });

  return (
    <div className='new-game-container'>
      <h2>Create New Game</h2>
      {errorMessage && <div className='error-message'>*{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            * Player Name:
            <input
              type='text'
              value={playerName}
              onChange={(e) =>
                setPlayerName(
                  e.target.value.trim() !== "" ? e.target.value : ""
                )
              }
            />
          </label>
        </div>
        <div>
          <label>
            * How Many Questions (50-200):
            <input
              type='number'
              min='50'
              max='200'
              value={boardSize}
              onChange={(e) =>
                setBoardSize(
                  e.target.value.trim() !== "" ? parseInt(e.target.value) : ""
                )
              }
            />
          </label>
        </div>
        <div>
          <label>
            * Number of Players (minimum 2):
            <input
              type='number'
              min='2'
              value={numPlayers}
              onChange={(e) =>
                setNumPlayers(
                  e.target.value.trim() !== "" ? parseInt(e.target.value) : ""
                )
              }
            />
          </label>
        </div>
        <div>
          <label>
            * Number of Turns (5-20):
            <input
              type='number'
              min='5'
              max='20'
              value={numTurns}
              onChange={(e) =>setNumTurns(e.target.value.trim() !== "" ? parseInt(e.target.value) : "")}
            />
          </label>
        </div>
        <button type='submit'>Create Game</button>
      </form>
    </div>
  );
};

export default NewGameForm;
