import React from "react";
import './Home.css';
import NewGameForm from "./NewGame";
export default function Home() {
    return <div className="home-comtainer">
        <div className="home-text-container">
            <h1>Math For <br /> <span>Everyone</span></h1>
            {/* <Link className="home-game-start-btn" to={'/new-game'}><BsPlayFill className="play-icon" /> Start</Link> */}
            <NewGameForm />
        </div>
    </div>;
}
