import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./JoinGame.css";
import socket from "../socket";

const JoinGame = () => {
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [gameDetails, setGameDetails] = useState({});

  const history = useHistory();

  useEffect(() => {
    socket.on("join-game-success", (data) => {
      console.log("join-game-success event:", data);
      history.push(
        `/game-board/${data.gameId}/${data.numPlayers}/${data.boardSize}?playerName=${playerName}`
      );
    });
    socket.on("player_joined", (data) => {
      console.log("player-joined event:", data);
      setSuccessMessage(
        data.playersJoined > 1
          ? "Joined successfully"
          : "Waiting for other players to join"
      );
    });
    socket.on("error", (data) => {
      console.log("error event:", data);
      setErrorMessage(data.error);
    });
    socket.on("game_not_found", (data) => {
      console.log("game_not_found event:", data);
      setErrorMessage(`Game ${data.gameId} not found.`);
    });
    socket.on("game_join_error", (data) => {
      console.log("game_join_error event:", data);
      setErrorMessage(data.error);
    });
    socket.on("join-game-success", (data) => {
      console.log("join-game-success event:", data);
      setSuccessMessage(
        `Player ${data.player.name} joined game ${data.gameId}`
      );
      setGameDetails(data);
    });

    return () => {
      socket.off("player-joined");
      socket.off("error");
      socket.off("game_not_found");
      socket.off("game_join_error");
      socket.off("join-game-success");
    };
  }, [history, playerName]);

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!playerName) {
      setErrorMessage("Player name is required.");
      return;
    }
    if (!gameId) {
      setErrorMessage("Game ID is required.");
      return;
    } else if (/^\d/.test(playerName)) {
      setErrorMessage("Player name should not start with a digit");
      return;
    }
    console.log("join-game emitted with data:", { gameId, playerName });
    socket.emit("join-game", { gameId, playerName });
  };

  return (
    <div className='join-game-container'>
      <h2>Join a Game</h2>
      {errorMessage && <div className='error-message'>*{errorMessage}</div>}
      {successMessage && (
        <div className='success-message'>{successMessage}</div>
      )}
      <form onSubmit={handleJoinGame}>
        <div className='form-group'>
          <label htmlFor='gameId'>Game ID:</label>
          <input
            type='text'
            id='gameId'
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='playerName'>Player Name:</label>
          <input
            type='text'
            id='playerName'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
        <button type='submit'>Join Game</button>
      </form>
    </div>
  );
};

export default JoinGame;
