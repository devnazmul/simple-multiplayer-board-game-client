import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import GameBoard from "./components/GameBoard";
import GameBoardPage from "./components/GameBoardPage";
import Lobby from "./components/Lobby";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Lobby} />
        <Route
          exact
          path='/game/:gameId/:numberOfPlayer/:sizeOfBoard'
          component={GameBoard}
        />
        <Route
          exact
          path='/game-board/:gameId/:numberOfPlayer/:sizeOfBoard'
          component={GameBoardPage}
        />
        {/* <Route exact path="/game-board/" component={GameBoardPage} /> */}
      </Switch>
      {/* {gameState && (
        <GameBoard gameId={gameState} onExit={handleExitGame} />
      )} */}
    </Router>
  );
}

export default App;
