import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import socket from "../socket";
import "./JoinGame.css";

const JoinGameBoard = () => {
  const { gameId } = useParams()
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [gameDetails, setGameDetails] = useState({});

  const history = useHistory();

  useEffect(() => {
    socket.on("join-game-success", (data) => {
      history.push(
        `/game-board/${data.gameId}/${data.numPlayers}/${data.boardSize}?playerName=${playerName}`
      );
    });
    socket.on("player_joined", (data) => {
      setSuccessMessage(
        data.playersJoined > 1
          ? "Joined successfully"
          : "Waiting for other players to join"
      );
    });
    socket.on("error", (data) => {
      setErrorMessage(data.error);
    });
    socket.on("game_not_found", (data) => {
      setErrorMessage(`Game ${data.gameId} not found.`);
    });
    socket.on("game_join_error", (data) => {
      setErrorMessage(data.error);
    });
    socket.on("join-game-success", (data) => {
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
    socket.emit("join-game", { gameId, playerName });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '40px',margin:'20px 0px' }}>Math Gasme</h1>
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
              disabled={true}
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
    </div>

  );
};

export default JoinGameBoard;
