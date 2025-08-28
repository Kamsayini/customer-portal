import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PowerUsageChart = ({ customerRef, startTime, durationMinutes }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!customerRef || !startTime || !durationMinutes) return;

    const wsUrl = `ws://localhost:5095/ws/single?customerRef=${customerRef}&startTime=${encodeURIComponent(startTime)}&durationMinutes=${durationMinutes}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log("✅ Connected to WebSocket");

    socket.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);

        const newPoint = {
          time: new Date(incoming.Timestamp).toLocaleTimeString(),
          power: Number((incoming.AvgImportKw * 1000).toFixed(2)), // Convert kW to W
          voltage: 230, // Placeholder since voltage isn't in payload
        };

        setData((prev) => [...prev.slice(-10), newPoint]);
      } catch (err) {
        console.error("❌ Error parsing message:", err);
      }
    };

    socket.onerror = (err) => console.error("❌ WebSocket error", err);
    socket.onclose = () => console.log("🔌 WebSocket closed");

    return () => socket.close();
  }, [customerRef, startTime, durationMinutes]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔌 Real-Time Power Consumption for {customerRef}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="power" stroke="#8884d8" name="Power (W)" />
          <Line type="monotone" dataKey="voltage" stroke="#82ca9d" name="Voltage (V)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerUsageChart;
