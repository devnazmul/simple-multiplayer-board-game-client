import React from "react";
import JoinGame from "./JoinGame";
import "./Lobby.css";
import NewGame from "./NewGame";


export default function Lobby() {
  return (
    <div className="lobby-container">
      <NewGame />
      <JoinGame />
    </div>
  );
}
