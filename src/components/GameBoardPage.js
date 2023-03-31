import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import socket from "../socket";
import "./GameBoardPage.css"; // Import the CSS file
import GameOverScreen from "./GameOverScreen";
import MainGameScreen from "./MainGameScreen";
import WaitingScreen from "./WaitingScreen";

const GameBoardPage = () => {
  const { gameId, numberOfPlayer } = useParams();

  const history = useHistory()

  const [gameDetails, setGameDetails] = useState(null);
  const [gameStarted, setGameStarted] = useState(false); // add state to track game started status
  const [board, setBoard] = useState(null); // Add state for the board
  const [players, setPlayers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playersRanking, setPlayersRanking] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedSquare, setSelectedSquare] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentPlayer = players.find((player) => player.id === socket.id);

  const [turnTimeLeft, setTurnTimeLeft] = useState(10);

  const [playerWhoseTurnItIs, setPlayerWhoseTurnItIs] = useState();

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let timerId;
    if ((turnTimeLeft > 0) && (currentPlayer && currentPlayer.nextTurn) && gameStarted) {
      timerId = setInterval(() => {
        setTurnTimeLeft(turnTimeLeft - 1);
      }, 1000);
    } else if (turnTimeLeft === 0) {
      const unusedBox = board.filter(obj => !obj.alreadyPlayed);
      setTurnTimeLeft(-1);
      setSelectedSquare(unusedBox[Math.floor(Math.random() * unusedBox.length)]?.counter)
    }
    return () => clearInterval(timerId);
  }, [turnTimeLeft, currentPlayer, gameStarted]);


  useEffect(() => {
    const handleScoreChange = (data) => {
      setPlayerWhoseTurnItIs(data?.players.find(p => p?.nextTurn === true)?.name)
      setGameDetails(data);
      setBoard(data.board);
      setPlayers(data.players);
      setJoinedPlayers(data?.players.length);
      setTurnTimeLeft(10)
    };

    // subscribe to the scoreChange event
    socket.on("scoreChange", handleScoreChange);

    // unsubscribe from the scoreChange event before component unmounts
    return () => {
      socket.off("scoreChange", handleScoreChange);
    };

  }, []);


  useEffect(() => {
    const handleGameCompleted = (data) => {
      setIsLoading(true);
      setGameCompleted(true);
      setWinner(data.winner);
      console.log(data);
      setPlayersRanking(data.playersRanking);
    };
    // subscribe to the scoreChange event
    socket.on("gamecompleted", handleGameCompleted);

    // unsubscribe from the scoreChange event before component unmounts
    return () => {
      socket.off("scoreChange", handleGameCompleted);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const getGameDetails = async () => {
      try {
        const response = await axios.get(`/game/${gameId}`);
        setGameDetails(response.data);
        setBoard(response.data.board); // Set board state from API call
        setPlayers(response.data.players);
        setJoinedPlayers(response.data?.players.length); // Set board state from API call
        setIsLoading(false);
        setGameCompleted(false);
      } catch (error) {
      }
    };
    getGameDetails();
  }, [gameId]);


  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);


  useEffect(() => {
    if (selectedSquare !== -1) {
      setShowModal(true);
    }
  }, [selectedSquare]);


  const handleSquareClick = (index) => {
    if (currentPlayer && currentPlayer.nextTurn) {
      setSelectedSquare(index);
      setTurnTimeLeft(-1)
    }
  };


  const handleModalClose = () => {
    setSelectedSquare(-1);
    setShowModal(false);
  };


  const handleAnswerSubmit = async (answer) => {
    const score =
      answer == parseInt(board[selectedSquare].answer)
        ? parseInt(board[selectedSquare].answer)
        : 0;
    const playerIndex = players.findIndex((player) => player.id === socket.id);
    const response = await axios.post(
      `/game/${gameId}/score/${playerIndex}/${selectedSquare}`,
      { score: score, playerAnswer: answer, timeToAnswer: 20 - timeLeft }
    );
    setGameDetails(response.data);
    setBoard(response.data.board); // Set board state from API call
    setShowModal(false);
    setTimer(0);
  };


  socket.on("playerJoined", (data) => {
    setJoinedPlayers(data?.players.length);
  });

  socket.on("game-started", (data) => {
    setPlayerWhoseTurnItIs(data?.game?.players.find(p => p?.nextTurn === true)?.name)
    setGameStarted(true);
    setTurnTimeLeft(10)
  });

  return (
    <div className='game-board'>
      {!gameStarted && !isLoading ? (
        <WaitingScreen
          gameId={gameId}
          numberOfPlayer={numberOfPlayer}
          gameDetails={gameDetails}
        />
      ) : (
        <>
          {!isLoading && !gameCompleted && (
            <MainGameScreen
              currentPlayer={currentPlayer}
              turnTimeLeft={turnTimeLeft}
              gameDetails={gameDetails}
              socket={socket}
              board={board}
              handleSquareClick={handleSquareClick}
              showModal={showModal}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              selectedSquare={selectedSquare}
              handleModalClose={handleModalClose}
              handleAnswerSubmit={handleAnswerSubmit}
              setShowModal={setShowModal}
              playerWhoseTurnItIs={playerWhoseTurnItIs}
              joinedPlayers={joinedPlayers}
            />
          )}


          {isLoading && gameCompleted && (
            <GameOverScreen players={players} socket={socket} winner={winner} playersRanking={playersRanking} />
          )}
        </>
      )}
    </div>
  );
};

export default GameBoardPage;
