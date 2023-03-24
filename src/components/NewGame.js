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
    <>
      {errorMessage && <div className='error-message'>*{errorMessage}</div>}
      <form className="newGameForm" onSubmit={handleSubmit}>
        <div className="formRow">
          <div className="singleInputContainer">
            <label htmlFor="player">* Player Name</label>
            <input
              id="player"
              type='text'
              value={playerName}
              onChange={(e) =>
                setPlayerName(
                  e.target.value.trim() !== "" ? e.target.value : ""
                )
              }
            />
          </div>
          <div className="singleInputContainer">
            <label htmlFor="questions">* How Many Questions (50-200)</label>
            <input
              id="questions"
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
          </div>
        </div>


        <div className="formRow">
          <div className="singleInputContainer">
            <label htmlFor="players">* Number of Players (minimum 2)</label>
            <input
              id="players"
              type='number'
              min='2'
              value={numPlayers}
              onChange={(e) =>
                setNumPlayers(
                  e.target.value.trim() !== "" ? parseInt(e.target.value) : ""
                )
              }
            />
          </div>
          <div className="singleInputContainer">
            <label htmlFor="turn"> * Number of Turns (5-20)</label>
            <input
              id="turn"
              type='number'
              min='5'
              max='20'
              value={numTurns}
              onChange={(e) => setNumTurns(e.target.value.trim() !== "" ? parseInt(e.target.value) : "")}
            />
          </div>
        </div>

        <button type='submit' class="fancy-button bg-gradient1">
          <span>Create New Game</span>
        </button>
 
      </form>
    </>
  );
};

export default NewGameForm;
