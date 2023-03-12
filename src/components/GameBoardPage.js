import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import "./GameBoardPage.css"; // Import the CSS file
import QuestionModal from "./QuestionModal";
import Square from "./Square";

const GameBoardPage = () => {
  const [gameDetails, setGameDetails] = useState(null);
  const [gameStarted, setGameStarted] = useState(false); // add state to track game started status
  const { gameId, numPlayers, boardSize } = useParams();
  const [board, setBoard] = useState(null); // Add state for the board
  const [players, setPlayers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState(0);
  const [eventEmitted, setEventEmitted] = useState(false);

  const [selectedSquare, setSelectedSquare] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  socket.on("scoreChange", (data) => {
    console.log("Received scoreChange event with data:", data);
    setGameDetails(data);
    setBoard(data.board);
    setPlayers(data.players);
    setJoinedPlayers(data?.players.length);
    setEventEmitted(false);
    // Set board state from API call
  });

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // console.log(`Game is in Board Page ${gameDetails}`);

  const handleSquareClick = (index) => {
    console.log("Players Array:", players);
    const currentPlayer = players.find((player) => player.id === socket.id);
    console.log("Current Player:", currentPlayer);
    if (currentPlayer && currentPlayer.nextTurn) {
      console.log("Square Index Clicked ", index);
      setSelectedSquare(index);
    }
  };

  useEffect(() => {
    if (selectedSquare !== -1) {
      console.log("Selected Square: ", selectedSquare);
      setEventEmitted(false);
      setTimer(0);
      setShowModal(true);
    }
  }, [selectedSquare, setShowModal]);

  const handleModalClose = () => {
    setSelectedSquare(-1);
    setShowModal(false);
    setTimer(0);
  };

  const handleAnswerSubmit = async (answer) => {
    console.log("handleAnswerSubmit called");
    const score =
      answer == parseInt(board[selectedSquare].answer)
        ? parseInt(board[selectedSquare].answer)
        : 0;
    const playerIndex = players.findIndex((player) => player.id === socket.id);

    console.log(board[selectedSquare], score);
    const response = await axios.post(
      `/game/${gameId}/score/${playerIndex}/${selectedSquare}`,
      { score: score }
    );
    setGameDetails(response.data);
    setBoard(response.data.board); // Set board state from API call
    setShowModal(false);
    setTimer(0);
  };

  // const handleAnswerSubmit = (answer) => {
  //   const score =
  //     answer == parseInt(board[selectedSquare].answer)
  //       ? parseInt(board[selectedSquare].answer)
  //       : 0;
  //   console.log("----", board[selectedSquare].answer, "   -   ", answer);
  //   console.log("score   -  ", score);
  //   // if (score) {
  //   console.log(board[selectedSquare]);
  //   socket.emit("updateScore", {
  //     gameId,
  //     playerIndex: players.findIndex((player) => player.id === socket.id),
  //     selectedSquare,
  //     score,
  //   });
  //   // }
  //   setShowModal(false);
  //   setTimer(0);
  // };

  // const handleAnswerSubmit = (answer) => {
  //   console.log("handleAnswerSubmit called");
  //   const score =
  //     answer == parseInt(board[selectedSquare].answer)
  //       ? parseInt(board[selectedSquare].answer)
  //       : 0;

  //   if (!eventEmitted) {
  //     socket.emit("updateScore", {
  //       gameId,
  //       playerIndex: players.findIndex((player) => player.id === socket.id),
  //       selectedSquare,
  //       score,
  //     });
  //     setEventEmitted(true);
  //   }

  //   setShowModal(false);
  //   setTimer(0);
  // };

  socket.on("playerJoined", (data) => {
    console.log({ playerJoin: data });
    setJoinedPlayers(data?.players.length);
  });

  useEffect(() => {
    setIsLoading(true);
    const getGameDetails = async () => {
      try {
        const response = await axios.get(`/game/${gameId}`);
        console.log({ res: response.data });
        setGameDetails(response.data);
        setBoard(response.data.board); // Set board state from API call
        setPlayers(response.data.players);
        setJoinedPlayers(response.data?.players.length); // Set board state from API call
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getGameDetails();
  }, [gameId]);

  socket.on("game-started", (data) => {
    setGameStarted(true);
  });

  useEffect(() => {
    console.log({ gameDetails });
  }, [gameDetails]);

  return (
    <div className='game-board'>
      {!gameStarted && !isLoading ? (
        <div className='lobby-section'>
          <h1>Waiting for the game to start...</h1>
          <div>Game ID: {gameId}</div>
          <div>Number of Players: {numPlayers}</div>
          {gameDetails && (
            <div>
              <div>Players Joined: {gameDetails.players.length}</div>
              <div>
                Players Name:{" "}
                {gameDetails.players.map((player) => player.name).join(", ")}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {!isLoading && (
            <div>
              <h1 className='board-header'>Game Board</h1>
              <div>
                <div className='board-section'>
                  <table className='detailsTable'>
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameDetails.players.map((player) => (
                        <tr key={player.id}>
                          <td>
                            {player.id === socket.id ? (
                              <strong>{player.name}</strong>
                            ) : (
                              player.name
                            )}
                          </td>
                          <td>{player.score}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <strong>Board Size:</strong>
                        </td>
                        <td>{gameDetails.board.length}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Players:</strong>
                        </td>
                        <td>{gameDetails.numPlayers}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Turns:</strong>
                        </td>
                        <td>{gameDetails.numTurns}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Players Joined:</strong>
                        </td>
                        <td>{joinedPlayers}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 style={{ textAlign: "center" }}>Please Select A Box</h2>

                  {timer > 0 && <div className='timer'>Time left: {timer}</div>}
                </div>
                <div className='game-board'>
                  {board.map((item, index) => (
                    <div className='game-board-row' key={index}>
                      <div className='game-board-col'>
                        <Square
                          item={item}
                          key={index}
                          value={item.counter}
                          onClick={() => handleSquareClick(item.counter)}
                          cssClass={`square-${index % 5}`} // add cssClass prop with a value of `square-0`, `square-1`, `square-2`, or `square-3`
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {showModal && (
                  <QuestionModal
                    question={{
                      operand1: board[selectedSquare].operand1,
                      operator: board[selectedSquare].operator,
                      operand2: board[selectedSquare].operand2,
                    }}
                    onClose={handleModalClose}
                    onSubmit={handleAnswerSubmit}
                    isOpen={showModal}
                    setIsOpen={setShowModal}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoardPage;
