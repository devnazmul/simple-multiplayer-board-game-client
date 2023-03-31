import React from "react";
import CustomShareButton from "./CustomShareButton";
import "./WaitingScreen.css";


export default function WaitingScreen({ gameId, numberOfPlayer, gameDetails }) {
    return (
        <div className='lobby-section witing-screen'>
            <div className="waitting-container">
                <img className="waitingGif" src="/images/waiting.gif" alt="" />
                <h1 className="waitingScreenTitle">Waiting For Other Players...</h1>
                <table className='detailsTable'>
                    <tbody>
                        <tr>
                            <td>
                                Join Link:
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
        </div>
    );
}
