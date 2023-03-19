import axios from "axios";
import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import GameBoardPage from "./components/GameBoardPage";
import JoinGameBoard from "./components/JoinGameBoard";
import Lobby from "./components/Lobby";

function App() {
  axios.defaults.baseURL = "https://simple-socket-io-multi-player-math-game.onrender.com";

  const audioRef = useRef(null);

  useEffect(() => {
    setTimeout(()=>{
      audioRef.current.play();
    audioRef.current.loop = true;
    },2000)
  }, [audioRef]);


  return (
    <>
    <audio style={{display:'none'}} ref={audioRef} controls >
        <source src="/audio/background-lobby.ogg" type="audio/mpeg" />
      </audio>
      <Router>
        <Switch>
          <Route exact path='/' component={Lobby} />
          <Route
            exact
            path='/game-board/:gameId/:numberOfPlayer/:sizeOfBoard'
            component={GameBoardPage}
          />
          <Route
            exact
            path='/join-game/:gameId'
            component={JoinGameBoard}
          />
        </Switch>
      </Router>
    </>

  );
}

export default App;
