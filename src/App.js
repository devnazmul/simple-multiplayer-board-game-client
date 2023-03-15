import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import GameBoardPage from "./components/GameBoardPage";
import Lobby from "./components/Lobby";

function App() {
  axios.defaults.baseURL = "https://simple-socket-io-multi-player-math-game.onrender.com";
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Lobby} />
        <Route
          exact
          path='/game-board/:gameId/:numberOfPlayer/:sizeOfBoard'
          component={GameBoardPage}
        />
      </Switch>
    </Router>
  );
}

export default App;
