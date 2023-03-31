import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import GameBoardPage from "./components/GameBoardPage";
import Home from "./components/Home";
import JoinGameBoard from "./components/JoinGameBoard";

function App() {
  axios.defaults.baseURL = "https://simple-socket-io-multi-player-math-game.onrender.com";
  
  return (
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
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
  );
}

export default App;
