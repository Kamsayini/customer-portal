import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import PowerUsageChart from "../components/PowerUsageChart";
import BillingHistory from "../components/BillingHistory";
import EnergyCredits from "../components/EnergyCredits";
import Payment from "../components/Payment";
import PowerBidding from "../components/PowerBidding";
import EnergyMarket from "../components/EnergyMarket";
import Appliance from "../components/Appliance";
import BlackoutInfo from "../components/BlackoutInfo";
import LatestBidInfo from "../components/LatestBidInfo";
import NotificationListener from "../components/NotificationListener";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState(null); // ✅ NEW STATE

  // ✅ Get token and decode username
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(storedToken);
        const name = decoded.name || decoded.sub || "User";
        setUserName(name);
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/login");
      }
    }
  }, [navigate]);

  // ✅ Fetch reference number from backend
  useEffect(() => {
  const savedRef = localStorage.getItem("referenceNumber");
  if (savedRef) {
    setReferenceNumber(Number(savedRef)); // ✅ load instantly from cache
    return;
  }

  const fetchReferenceNumber = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5081/api/surplus/my-reference-number", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reference number");

      const data = await res.json();
      setReferenceNumber(data.referenceNumber);
      localStorage.setItem("referenceNumber", data.referenceNumber);
    } catch (err) {
      console.error("❌ Failed to load reference number:", err.message);
    }
  };

  fetchReferenceNumber();
}, [token]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {token && <NotificationListener token={token} />}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center mb-6 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {userName}! 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor your energy usage and Bidding Section Below.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* <Appliance /> */}
        <LatestBidInfo />
        <BlackoutInfo />
        <PowerUsageChart
          customerRef={referenceNumber} // ✅ use dynamic ref
          startTime={"2025-03-20T12:30:00Z"}
          durationMinutes={20}
        />
      </div>
    </div>
  );
};

export default Dashboard;
