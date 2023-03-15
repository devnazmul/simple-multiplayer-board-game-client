import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
// const socket = io(ENDPOINT);
const socket = io(ENDPOINT, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("disconnect", (reason) => {
  console.log(`disconnect due to ${reason}`);
});
export default socket;
