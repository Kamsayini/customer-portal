import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const fallbackSample = {
  nextBlackoutStart: null,
  yourBidPrice: null,
  highestBidPrice: null,
  hasBid: false,
};

const NextBidSummary = () => {
  const [summary, setSummary] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5081/api/surplus/last-bid-summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No summary found");

        const data = await res.json();
        setSummary(data);
        console.log("📦 Summary Data:", data);

      } catch (err) {
        console.warn("⚠️ Using fallback summary:", err.message);
        setSummary(fallbackSample);
        setUsingFallback(true);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) return <div className="text-gray-500">Loading next bid summary...</div>;

return (
  <div className="bg-white shadow p-6 rounded-lg max-w-xl mx-auto mt-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Last Bid Summary</h2>

    {usingFallback && (
      <div className="text-yellow-600 text-sm mb-4">
        Showing fallback data. No live record found.
      </div>
    )}

    <div className="space-y-2 text-gray-700">
      {summary.blackoutStart && summary.blackoutEnd ? (
  <p>
    <strong>Blackout:</strong>{" "}
    {dayjs.utc(summary.blackoutStart).format("YYYY-MM-DD HH:mm")} -{" "}
    {dayjs.utc(summary.blackoutEnd).format("HH:mm")}
  </p>
) : (
  <p>
        <strong>Blackout:</strong> No available info
      </p>
)}

      <p>
        <strong>Block Size:</strong> {summary.blockSizeKwh} kWh
      </p>
      <p>
        <strong>Your Bid:</strong> Rs. {summary.bidPrice}
      </p>
      <p>
        <strong>Top Bid:</strong> Rs. {summary.highestBidPrice}
      </p>
      
     
    </div>
  </div>
);

  
};

export default NextBidSummary;
