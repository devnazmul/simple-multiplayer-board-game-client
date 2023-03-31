import React from "react";
import './MainGameScreen.css';
import QuestionModal from "./QuestionModal";
import Square from "./Square";

export default function MainGameScreen({currentPlayer,turnTimeLeft,gameDetails,socket,board,handleSquareClick,showModal,timeLeft,setTimeLeft,selectedSquare,handleModalClose,handleAnswerSubmit,setShowModal,playerWhoseTurnItIs,joinedPlayers}) {
    return (
        <div className="MainGameBoardContainer">
            <div className="game-name">
                <img src="/images/game-board-title.png" alt="" />
            </div>
            <div className="timer-container">
                <div className="timer">
                    <img src="/images/timer.png" alt="" />
                    <span className="timer-text">
                        {(currentPlayer && currentPlayer.nextTurn && turnTimeLeft !== -1) ? <span >
                            00:{turnTimeLeft} sec
                        </span>
                            :
                            <span>
                                <span style={{ display: 'block' }}>It's another's</span>
                                <span style={{ display: 'block' }}>player's Turn</span>
                            </span>}
                    </span>
                </div>
            </div>

            <div className="main-graphical-gameboard-container">
                <div className="col-1">
                    <div className="score-container">
                        <img className="gameScoreImage" src="/images/game-soreboard.png" alt="" />
                        <div className="score">
                            <table className="scoreTable">
                                <thead>
                                    <tr>
                                        <th className="scoreTableHead">Player</th>
                                        <th className="scoreTableHeadScore">Score</th>
                                    </tr>
                                </thead>
                                {gameDetails?.players !== undefined &&
                                    gameDetails?.players.map((player) => (
                                        <tr style={{ width: '100%' }} key={player.id}>
                                            <td >
                                                {player.id === socket.id ? (
                                                    <strong>{player.name}</strong>
                                                ) : (
                                                    player.name
                                                )}
                                            </td>
                                            <td className="scoreCol">{player.score}</td>
                                        </tr>
                                    ))}
                            </table>
                        </div>
                    </div>
                    <img className="cat-image" src="/images/cat.png" alt="" />
                </div>

                <div className="col-2">
                    <img className="gameBoardImage" src="/images/game-board.png" alt="" />
                    <div className='main-game-board'>
                        {board !== undefined &&
                            board.map((item, index) => (
                                <div key={index}>
                                    <div>
                                        <Square
                                            item={item}
                                            i={index}
                                            value={item.counter}
                                            onClick={() => handleSquareClick(item.counter)}
                                        />
                                    </div>
                                </div>
                            ))}
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

                <div className="col-3">
                    <img className="player-board" src="/images/game-player.png" alt=""/>
                    <div className="players-board">
                        <div className="currentPlayerName">
                            {!(currentPlayer && currentPlayer.nextTurn) ?
                                <>It's <span className="pName">{playerWhoseTurnItIs}'s</span> Turn. Please wait for your.</>
                                :
                                <>Its your turn. Please Select A Box</>
                            }
                        </div>
                        <table className="scoreTable">
                            <tbody>
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
                    </div>
                </div>

                <div className="board-for-mobile">
                    <div className="col-1">
                        <div className="score-container">
                            <img className="gameScoreImage" src="/images/game-soreboard.png" alt="" />
                            <div className="score">
                                <table className="scoreTable">
                                    <thead>
                                        <tr>
                                            <th className="scoreTableHead">Player</th>
                                            <th className="scoreTableHeadScore">Score</th>
                                        </tr>
                                    </thead>
                                    {gameDetails?.players !== undefined &&
                                        gameDetails?.players.map((player) => (
                                            <tr style={{ width: '100%' }} key={player.id}>
                                                <td >
                                                    {player.id === socket.id ? (
                                                        <strong>{player.name}</strong>
                                                    ) : (
                                                        player.name
                                                    )}
                                                </td>
                                                <td className="scoreCol">{player.score}</td>
                                            </tr>
                                        ))}
                                </table>
                            </div>
                        </div>
                        <img className="cat-image" src="/images/cat.png" alt="" />
                    </div>
                    <div className="col-3">
                        <img className="player-board" src="/images/game-player.png" alt="" />
                        <div className="players-board">
                            <table className="scoreTable">
                                <tbody>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
