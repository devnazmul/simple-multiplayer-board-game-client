// api.js

const API_BASE_URL = "https://simple-socket-io-multi-player-math-game.onrender.com";

export async function createGame(
  playerName, 
  boardSize, 
  numPlayers, 
  numTurns
  ) {
  const response = await fetch(`${API_BASE_URL}/new-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerName,
      boardSize,
      numPlayers,
      numTurns
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
