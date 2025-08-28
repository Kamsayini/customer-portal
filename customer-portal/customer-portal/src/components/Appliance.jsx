import { useState } from "react";
import appliances from "../assets/appliances";
import { useEffect } from "react";

const Appliance = ({ blackout }) => {
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [count, setCount] = useState(1);
  const [duration, setDuration] = useState(30);
  const [applianceList, setApplianceList] = useState([]); // Allocated energy in kWh
  const [requestedEnergy, setRequestedEnergy] = useState(0);

  const [bidPrice, setBidPrice] = useState(0);
  const [bidBlock, setBidBlock] = useState(null);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [allocatedEnergy, setAllocatedEnergy] = useState(0);
  const [surplusBlocks, setSurplusBlocks] = useState([]);

  useEffect(() => {
    if (!blackout) return;

    const token = localStorage.getItem("token");
    const blackoutStartISO = `${blackout.date}T${blackout.startTime}Z`;
    const blackoutEndISO = `${blackout.date}T${blackout.endTime}Z`;

    const url = `http://localhost:5081/api/surplus/blocks?blackoutStart=${blackoutStartISO}&blackoutEnd=${blackoutEndISO}`;

    console.log("📦 Requesting surplus blocks for:");
    console.log("🕒 Start:", blackoutStartISO);
    console.log("🕒 End:", blackoutEndISO);
    console.log("🌐 URL:", url);

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Blocks received:", data);
        setSurplusBlocks(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching blocks:", err);
      });
  }, [blackout]);

useEffect(() => {
  if (!blackout) return;

  const token = localStorage.getItem("token");
  const blackoutStartISO = `${blackout.date}T${blackout.startTime}Z`;
  const blackoutEndISO = `${blackout.date}T${blackout.endTime}Z`;

  const fetchReferenceAndPrediction = async () => {
    try {
      // Step 1: Get reference number
      const refRes = await fetch("http://localhost:5081/api/surplus/my-reference-number", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!refRes.ok) throw new Error("Failed to fetch reference number");
      const refData = await refRes.json();
      const customerRef = refData.referenceNumber;

      

      // Step 2: Use reference to get predicted usage
      const predictionUrl = `http://localhost:5095/api/prediction/predicted-usage?customerRef=${customerRef}&from=${blackoutStartISO}&to=${blackoutEndISO }`;

      const predRes = await fetch(predictionUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!predRes.ok) {
        const errorText = await predRes.text();
        console.error("❌ Prediction error:", errorText);
        throw new Error("Prediction fetch failed");
      }

      const predictedUsage = await predRes.json();
      console.log("✅ Predicted usage:", predictedUsage);
      setAllocatedEnergy(predictedUsage); // API returns a number
    } catch (err) {
      console.error("❌ Failed to fetch forecast:", err.message);
    }
  };

  fetchReferenceAndPrediction();
}, [blackout]);


  const addAppliance = () => {
    if (selectedAppliance && count > 0 && duration > 0) {
      const appliance = appliances.find((a) => a.name === selectedAppliance);
      setApplianceList([
        ...applianceList,
        {
          name: appliance.name,
          power: appliance.power,
          count,
          duration,
        },
      ]);
      setSelectedAppliance("");
      setCount(1);
      setDuration(30);
    }
  };

  const removeAppliance = (index) => {
    const newList = [...applianceList];
    newList.splice(index, 1);
    setApplianceList(newList);
  };

  const calculateEnergy = () => {
    let totalEnergy = 0;
    applianceList.forEach((item) => {
      const energy = (item.power * item.count * (item.duration / 60)) / 1000; // in kWh
      totalEnergy += energy;
    });
    setRequestedEnergy(totalEnergy);
    setBidBlock(null);
    setBidPrice(0);
    setBidSubmitted(false);
  };

  const extraEnergy = requestedEnergy - allocatedEnergy;

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        ⚡ Energy Request Form
      </h2>

      {/* Appliance Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedAppliance}
          onChange={(e) => setSelectedAppliance(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Appliance</option>
          {appliances.map((appliance, index) => (
            <option key={index} value={appliance.name}>
              {appliance.name} ({appliance.power}W)
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Count"
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (mins)"
          className="p-2 border rounded w-full"
        />

        <button
          onClick={addAppliance}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add ➕
        </button>
      </div>

      {/* Selected Appliances List */}
      {applianceList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            📝 Selected Appliances
          </h3>
          <ul className="space-y-3">
            {applianceList.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span>
                  {item.name} × {item.count} for {item.duration} mins
                </span>
                <button
                  onClick={() => removeAppliance(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Calculate & Energy Info */}
      <div className="text-center space-y-4">
        <button
          onClick={calculateEnergy}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Calculate Requested Energy
        </button>

        {requestedEnergy > 0 && (
          <div>
            <h3 className="text-xl font-bold mt-4">
              🔋 Total Requested: {requestedEnergy.toFixed(2)} kWh
            </h3>
            <h3 className="text-lg mt-2">
              📦 Allocated: {allocatedEnergy.toFixed(2)} kWh
            </h3>
            {requestedEnergy <= allocatedEnergy ? (
              <p className="text-green-500 font-bold mt-2">
                ✅ No bidding required.
              </p>
            ) : (
              <p className="text-red-500 font-bold mt-2">
                ⚡ Exceeds allocation. Bidding required for extra{" "}
                {extraEnergy.toFixed(2)} kWh.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bidding Section */}
      {extraEnergy > 0 && !bidSubmitted && (
        <div className="mt-8 p-6 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">
            ⚡ Bidding for Extra Energy
          </h3>

          {/* Energy Block Selector */}
          <div className="mb-4">
            <label className="font-semibold mb-2 block">
              Select an energy block (kWh):
            </label>
            <div className="grid grid-cols-3 gap-3">
              {surplusBlocks.map((block, i) => {
                const isEligible = block.blockSizeKwh;
                const isSelected = bidBlock === block;

                return (
                  <button
                    key={i}
                    disabled={!isEligible}
                    onClick={() => setBidBlock(block)}
                    className={`
            p-4 text-center rounded-lg border font-semibold transition
            ${
              isEligible
                ? "cursor-pointer"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }
            ${
              isSelected
                ? "bg-blue-600 text-white"
                : isEligible
                ? "bg-white hover:bg-blue-100"
                : ""
            }
          `}
                  >
                    <div>{block.blockSizeKwh} kWh</div>
                    <div className="text-sm text-gray-600">
                      {block.hasBids
                        ? `Top Bid: Rs.${block.highestBidPrice}`
                        : "No bids yet"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bid Price */}
          <div className="mb-4">
            <label className="font-semibold mb-1 block">
              Enter your bid price (Rs.):
            </label>
            <input
              type="number"
              min="0"
              value={bidPrice}
              onChange={(e) => setBidPrice(Number(e.target.value))}
              placeholder="Enter bid amount"
              className="p-2 border rounded w-full"
            />
          </div>

          <button
            disabled={!bidBlock || bidPrice <= 0}
            onClick={async () => {
              if (!bidBlock?.blockId) {
                alert("❌ Please select a valid energy block.");
                return;
              }

              if (bidPrice < bidBlock.minBidPricePerKwh) {
                alert(
                  `❌ Minimum price is Rs. ${bidBlock.minBidPricePerKwh}/kWh`
                );
                return;
              }

              const token = localStorage.getItem("token");

              const payload = {
                blockId: bidBlock.blockId,
                bidAmountKwh: bidBlock.blockSizeKwh, // ✅ full block size
                pricePerKwh: bidPrice,
              };

              try {
                const response = await fetch(
                  "http://localhost:5081/api/surplus/submit-bid",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  }
                );

                const result = await response.json();

                if (response.ok) {
                  setBidSubmitted(true);
                  console.log("✅ Bid submitted:", result);
                } else {
                  alert(result.message || "❌ Bid submission failed.");
                }
              } catch (err) {
                console.error("❌ Error submitting bid:", err);
                alert("❌ Network error submitting bid.");
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Submit Bid
          </button>
        </div>
      )}

      {/* Confirmation */}
      {bidSubmitted && bidBlock && (
        <div className="mt-8 p-6 bg-green-100 border rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            ✅ Bid Submitted!
          </h3>
          <p className="text-green-600">
            You bid <strong>Rs. {bidPrice}</strong> for{" "}
            <strong>{bidBlock.blockSizeKwh} kWh</strong> of extra energy.
          </p>
        </div>
      )}
    </div>
  );
};

export default Appliance;
