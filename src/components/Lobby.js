import React from "react";
import "./Lobby.css";
import NewGame from "./NewGame";


export default function Lobby() {

  return (
    <div style={{padding:'20px 0px'}}  className="lobby-main-container">
      <h1 style={{textAlign:'center',fontSize:'40px',margin:'10px 0px'}}>Math Game</h1>
      <div className="lobby-container">
        <NewGame />
      </div>
    </div>

  );
}
