import { WebSocketServer } from "ws"; // Use ES module import

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  setInterval(() => {
    const marketPrice = (Math.random() * (0.40 - 0.10) + 0.10).toFixed(2);
    ws.send(JSON.stringify({ marketPrice }));
  }, 3000);

  ws.on("close", () => console.log("Client disconnected"));
});

console.log("WebSocket Server running on ws://localhost:8080");
