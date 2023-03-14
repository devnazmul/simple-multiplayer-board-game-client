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
  const [gameCompleted, setGameCompleted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playersRanking, setPlayersRanking] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedSquare, setSelectedSquare] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScoreChange = (data) => {
      setGameDetails(data);
      setBoard(data.board);
      setPlayers(data.players);
      setJoinedPlayers(data?.players.length);
      setEventEmitted(true);
    };
    // subscribe to the scoreChange event
    socket.on("scoreChange", handleScoreChange);

    // unsubscribe from the scoreChange event before component unmounts
    return () => {
      socket.off("scoreChange", handleScoreChange);
    };
  }, []);

  const handleGameCompleted = (data) => {
    console.log("Received gamecompleted event ");
    setIsLoading(true)
    setGameCompleted(true);
    setWinner(data.winner);
    setPlayersRanking(data.playersRanking);
    console.log("Received gamecompleted event with data:", data.winner);
  };

  // subscribe to the gamecompleted event
  socket.on("gamecompleted", handleGameCompleted);

  // const isMountedRef = useRef(true);

  // useEffect(() => {
  //   // listen for the "gamecompleted" socket event
  //   socket.on("gamecompleted", ({ winner, playersRanking }) => {
  //     if (isMountedRef.current) {
  //       setIsLoading(false);
  //       setGameCompleted(true);
  //       setWinner(winner);
  //       setGameDetails(false);
  //       setPlayersRanking(playersRanking);
  //       console.log("Received gamecompleted event with data:", winner);
  //     }
  //   });

  //   // cleanup function to remove event listener and set isMountedRef to false
  //   return () => {
  //     isMountedRef.current = false;
  //     socket.off("gamecompleted");
  //   };
  // }, []);

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
      setShowModal(true);
    }
  }, [selectedSquare, setShowModal]);

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
      { score: score, timeOfSubmision: 20 - timeLeft }
    );
    setGameDetails(response.data);
    setBoard(response.data.board); // Set board state from API call
    setShowModal(false);
    setTimer(0);
  };

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
        setGameCompleted(false)
      } catch (error) {
        console.log(error);
      }
    };
    getGameDetails();
  }, [gameId]);

  socket.on("game-started", (data) => {
    setGameStarted(true);
  });


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
          {(!isLoading && !gameCompleted) && (
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
                      {gameDetails?.players !== undefined && gameDetails?.players.map((player) => (
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
                        <td>{gameDetails.board !== undefined && gameDetails?.board?.length}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Players:</strong>
                        </td>
                        <td>{gameDetails?.numPlayers}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Turns:</strong>
                        </td>
                        <td>{gameDetails?.numTurns}</td>
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
                  {board !== undefined && board.map((item, index) => (
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
                {showModal && board !== undefined && (
                  <QuestionModal
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                    question={{
                      operand1: board[selectedSquare].operand1,
                      operator: board[selectedSquare].operator,
                      operand2: board[selectedSquare].operand2,
                    }}
                    onClose={handleModalClose}
                    onSubmit={handleAnswerSubmit}
                    isOpen={showModal}
                  />
                )}
              </div>
            </div>
          )}
          {(isLoading && gameCompleted) && (
            <div>
              <h1 className='board-header'>Game Over</h1>
              <div>
                <h2>Game Winner: {winner}</h2>
                <div className='player-ranking'>
                  <h2>Player Ranking</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Turns</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playersRanking.map((player) => (
                        <tr key={player.id}>
                          <td>{player.name}</td>
                          <td>{player.score}</td>
                          <td>{player.turns}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoardPage;
