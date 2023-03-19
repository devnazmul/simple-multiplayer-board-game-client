import React from "react";
import JoinGame from "./JoinGame";
import "./Lobby.css";
import NewGame from "./NewGame";


export default function Lobby() {

  return (
    <div style={{padding:'20px 0px'}}  className="lobby-main-container">
      <h1 style={{textAlign:'center',fontSize:'50px'}}>Math Champ</h1>
      <div className="lobby-container">
        <NewGame />
        <JoinGame />
      </div>
    </div>

  );
}
