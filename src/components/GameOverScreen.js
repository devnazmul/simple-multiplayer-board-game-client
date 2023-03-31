import React, { Fragment } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { useHistory } from "react-router-dom";

export default function GameOverScreen({players,socket,winner,playersRanking}) {
    const history = useHistory();
    return (
        <div style={{ position: 'relative' }}>
            <button style={{ position: 'absolute', right: -10, top: 10 }} onClick={() => history.push("/")}>New Game</button>
            <h1 className='board-header'>Game Over</h1>
            <div>
                <img style={{ width: '100%', height: 'auto' }} src={`${players.find((player) => player.id === socket.id).name == winner ? '/images/win.gif' : '/images/loss.gif'}`} alt='game over' />
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
                    <Fragment key={player?.id}>
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
                    </Fragment>
                ))}
            </div>
        </div>);
}
