import { useState } from "react";
import useWebSocket from "react-use-websocket";

const SOCKET_URL = "ws://localhost:8080"; // WebSocket server

const EnergyMarket = () => {
  const [marketPrice, setMarketPrice] = useState(0.25);

  useWebSocket(SOCKET_URL, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      setMarketPrice(data.marketPrice);
    },
  });

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl text-center mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Energy Market</h2>
      <p className="text-lg">
        Current Energy Price: <span className="font-bold text-blue-600">${marketPrice} / kWh</span>
      </p>
    </div>
  );
};

export default EnergyMarket;
