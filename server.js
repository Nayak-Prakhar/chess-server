const WebSocket = require("ws");
const server = new WebSocket.Server({ port: process.env.PORT || 3000 });

let players = [];

server.on("connection", (socket) => {
  console.log("New connection");

  if (players.length >= 2) {
    socket.send(JSON.stringify({ type: "full" }));
    socket.close();
    return;
  }

  players.push(socket);
  socket.send(JSON.stringify({ type: "color", color: players.length === 1 ? "w" : "b" }));

  socket.on("message", (message) => {
    players.forEach((player) => {
      if (player !== socket && player.readyState === WebSocket.OPEN) {
        player.send(message);
      }
    });
  });

  socket.on("close", () => {
    players = players.filter((p) => p !== socket);
  });
});
