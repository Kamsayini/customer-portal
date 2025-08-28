import { useState } from "react";

const EnergyCredits = () => {
  const [credits, setCredits] = useState(120.5);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Energy Credits</h2>
      <p className="text-lg">
        Available Credits: <span className="font-bold text-green-500">{credits.toFixed(2)} kWh</span>
      </p>
      <button
        onClick={() => setCredits(credits - 10)}
        disabled={credits < 10}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition disabled:bg-gray-400"
      >
        Use 10 Credits
      </button>
    </div>
  );
};

export default EnergyCredits;
