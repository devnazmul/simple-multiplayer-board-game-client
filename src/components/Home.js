import React from "react";
import './Home.css';
import NewGameForm from "./NewGameForm";
export default function Home() {
    return (
        <div className="home-comtainer">
            <img className="mobileHomeImage" src="/images/mobileHome.webp" alt="" />
            <div className="home-text-container">
                <h1>Math For <br /> <span>Everyone</span></h1>
                <NewGameForm />
            </div>
        </div>);
}
