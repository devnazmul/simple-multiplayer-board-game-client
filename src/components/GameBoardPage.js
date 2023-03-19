import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { BsClockHistory } from "react-icons/bs";
import { useHistory, useParams } from "react-router-dom";
import socket from "../socket";
import CustomShareButton from "./CustomShareButton";
import "./GameBoardPage.css"; // Import the CSS file
import QuestionModal from "./QuestionModal";
import Square from "./Square";

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
        <div className='lobby-section'>
          <h1>Waiting for the game to start...</h1>
          <table className='detailsTable'>
            <tbody>
              <tr>
                <td>
                  <label>Join Link:</label>
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <span>https://simple-multiplayer-board-game-client.vercel.app/join-game/{gameId}</span>
                    <CustomShareButton
                      url={`https://simple-multiplayer-board-game-client.vercel.app/join-game/${gameId}`}
                      title='Share the game link to your friends'
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Number of Players:</td>
                <td>{numberOfPlayer}</td>
              </tr>

              {gameDetails && (
                <React.Fragment>
                  <tr>
                    <td>Players Joined:</td>
                    <td>{gameDetails.players.length}</td>
                  </tr>
                  <tr>
                    <td>Your Name:</td>
                    <td>
                      {gameDetails.players
                        .map((player) => player.name)
                        .join(", ")}
                    </td>
                  </tr>
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {!isLoading && !gameCompleted && (
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
                      {gameDetails?.players !== undefined &&
                        gameDetails?.players.map((player) => (
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
                        <td>
                          {gameDetails.board !== undefined &&
                            gameDetails?.board?.length}
                        </td>
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
                  <div>
                    {!(currentPlayer && currentPlayer.nextTurn) ?
                      <h2 style={{ textAlign: "center", color: 'red' }}>It's {playerWhoseTurnItIs}'s Turn. Please wait for your.</h2>
                      :
                      <h2 style={{ textAlign: "center", color: 'green' }}>Its your turn. Please Select A Box</h2>
                    }
                  </div>
                  {(currentPlayer && currentPlayer.nextTurn && turnTimeLeft !== -1) && <h4 style={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center' }}>Your turn end in : <BsClockHistory /> {turnTimeLeft} sec</h4>}
                </div>

                <div className='game-board'>
                  {board !== undefined &&
                    board.map((item, index) => (
                      <div className='game-board-row' key={index}>
                        <div className='game-board-col'>
                          <Square
                            item={item}
                            key={index}
                            value={item.counter}
                            onClick={() => handleSquareClick(item.counter)}
                            cssClass={`square-${index % 5}`}
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
                    setIsOpen={setShowModal}
                  />
                )}
              </div>
            </div>
          )}
          {isLoading && gameCompleted && (
            <div style={{ position: 'relative' }}>
              <button style={{ position: 'absolute', right: -10, top: 10 }} onClick={() => history.push("/")}>New Game</button>
              <h1 className='board-header'>Game Over</h1>
              <div>
                <img src={`${players.find((player) => player.id === socket.id).name == winner ? '/images/win.gif' : '/images/loss.gif'}`} alt='game over' />
                <h2>Game Winner: {winner}</h2>
                <div className='player-ranking'>
                  <h2>Player Ranking</h2>
                  <table className='detailsTable'>
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

                {players.map((player) => (
                  <>
                    {player.id === socket.id && <div key={player.id} className='player-details'>
                      <h2>Your Questions Details</h2>
                      <table className='detailsTable'>
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Your Answer</th>
                            <th>Is Correct</th>
                          </tr>
                        </thead>
                        <tbody>
                          {player.questions.map((question) => (
                            <tr key={question.question}>
                              <td>{question.question}</td>
                              <td>{question.answer}</td>
                              <td>
                                {question.isCorrect ?
                                  <span style={{ color: 'green' }}>
                                    <BiCheck style={{ fontSize: '20px' }} />
                                  </span>
                                  :
                                  <span style={{ color: 'red' }}>
                                    <BiX style={{ fontSize: '20px' }} />
                                  </span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>}
                  </>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoardPage;
