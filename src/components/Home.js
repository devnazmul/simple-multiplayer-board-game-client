import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [numberOfBoxes, setNumberOfBoxes] = useState(50);

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value >= 50 && value <= 150) {
      setNumberOfBoxes(value);
    }
  };

  return (
    <div className='home-container'>
      <h1>Welcome to the Game</h1>
      <div className='options'>
        <div className='new-game'>
          <h2>Start a new game</h2>
          <label htmlFor='player-name'>Enter your name:</label>
          <input type='text' id='player-name' required />
          <p>Number of boxes (50-150):</p>
          <input
            type='number'
            value={numberOfBoxes}
            onChange={handleInputChange}
            required
          />
          <Link to={`/game/new?numberOfBoxes=${numberOfBoxes}`}>
            <button className='start-button'>Start</button>
          </Link>
        </div>
        <div className='join-game'>
          <h2>Join an existing game</h2>
          <label htmlFor='game-url'>Enter game URL:</label>
          <input type='text' id='game-url' required />
          <Link to='/game/join'>
            <button className='join-button'>Join</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
