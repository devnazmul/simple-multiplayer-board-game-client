import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "../socket";
import Board from "./Board";
import Dice from "./Dice";

const GameBoard = () => {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerPosition, setPlayerPosition] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  console.log("Game Board Page is GameBoard.js");

  // get the value of a query parameter
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const playerName = query.get("playerName");
  const gameStatus = query.get("gameState");
  const { gameId, numberOfPlayer, sizeOfBoard } = useParams();
  // console.log({gameId, name, boardSize})

  // useEffect(() => {
  //   // const newSocket = io("https://simple-socket-io-multi-player-math-game.onrender.com");
  //   setSocket(io);

  //   return () => {
  //     io.close();
  //   };
  // }, []);

  useEffect(() => {
    io.emit("joinGame", gameId);
    io.on("playerJoined", (game) => {
      setPlayers(game?.players);
      console.log(game?.players);
    });

    io.on("game-started", (game) => {
      // setPlayerTurn(playerTurn);
      setGameState(game?.game?.status);
    });

    io.on("playerMoved", (data) => {
      const { playerName, playerPosition, playerScore, opponentScore } = data;
      setPlayerPosition(playerPosition);
      setPlayerScore(playerScore);
      setOpponentScore(opponentScore);
      setPlayerTurn((playerTurn) =>
        playerTurn === playerName ? "" : playerName
      );
    });

    io.on("gameOver", () => {
      setIsGameOver(true);
    });
    setIsLoading(false);
  }, [gameId]);

  // const handlePlayerNameChange = (event) => {
  //   setPlayerName(event.target.value);
  // };

  // useEffect(() => { console.log({ players }) }, [players])

  const handleRollDice = () => {
    const diceValue = Math.floor(Math.random() * 8);
    const newPosition = playerPosition + diceValue;
    const currentPlayerTurn = playerTurn === playerName ? "" : playerName;
    const data = {
      playerName,
      newPosition,
      diceValue,
      currentPlayerTurn,
    };
    socket.emit("playerMove", data);
  };

  const handleExitGame = () => {
    socket.emit("exitGame");
    // onExit();
  };

  return (
    <div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {gameStatus === "active" ? (
            // IF GAME IS IN ACTIVE STATE
            <div>
              <h1>Game Board</h1>
              <div>
                <span>
                  Player Turn: {playerTurn || "Waiting for other player..."}
                </span>
                <span>Player Position: {playerPosition}</span>
                <span>Player Score: {playerScore}</span>
                <span>Opponent Score: {opponentScore}</span>
                {isGameOver && <h2>Game Over!</h2>}
              </div>
              <Board
                boxes={sizeOfBoard}
                players={players}
                playerPosition={playerPosition}
              />
              <Dice
                onRoll={handleRollDice}
                disabled={!playerTurn || isGameOver}
              />
              <button onClick={handleExitGame}>Exit Game</button>
            </div>
          ) : (
            // IF GAME IS IN WAITING STATE
            <div className='waiting-container'>
              <h1>Hi, {playerName} Welcome to the game.</h1>
              <h2>Share your game id to other player: {gameId}</h2>
              <h4>Please waiting for other players.</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
