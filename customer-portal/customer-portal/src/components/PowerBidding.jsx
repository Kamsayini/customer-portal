import { useState } from "react";

const PowerBidding = () => {
  const [bidAmount, setBidAmount] = useState(0);
  const [bids, setBids] = useState([]);

  const placeBid = () => {
    if (bidAmount > 0) {
      setBids([...bids, { amount: bidAmount, time: new Date().toLocaleTimeString() }]);
      setBidAmount(0);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mt-50 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Power Bidding</h2>
      <div className="flex gap-3">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="p-3 border rounded-lg w-full"
          placeholder="Enter bid amount"
        />
        <button onClick={placeBid} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
          Place Bid
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold">Recent Bids</h3>
        {bids.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {bids.map((bid, index) => (
              <li key={index} className="border p-3 rounded-lg">
                <span className="font-bold">Rs. {bid.amount}</span> - {bid.time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bids placed yet.</p>
        )}
      </div>
    </div>
  );
};

export default PowerBidding;
