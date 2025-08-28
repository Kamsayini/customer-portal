import { useEffect, useState, Fragment } from "react";
import dayjs from "dayjs";
import axios from "axios";
import Appliance from "./Appliance"; // or correct path

const BlackoutInfo = () => {
  const [blackouts, setBlackouts] = useState([]);
  const [nextBlackout, setNextBlackout] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [selectedBlackout, setSelectedBlackout] = useState(null);
  const [selectedBlackoutIndex, setSelectedBlackoutIndex] = useState(null);

  useEffect(() => {
    const fetchBlackouts = async () => {
      try {
        const res = await axios.get("http://localhost:5095/api/blackout");
        const sorted = res.data.sort((a, b) =>
          dayjs(`${a.date}T${a.startTime}`).isAfter(
            dayjs(`${b.date}T${b.startTime}`)
          )
            ? 1
            : -1
        );
        setBlackouts(sorted);

        const now = dayjs();
        const upcoming = sorted.find((b) =>
          dayjs(`${b.date}T${b.startTime}`).isAfter(now)
        );
        setNextBlackout(upcoming);
      } catch (err) {
        console.error("Failed to load blackout data", err);
      }
    };

    fetchBlackouts();
  }, []);

  useEffect(() => {
    if (!nextBlackout) return;

    const interval = setInterval(() => {
      const now = dayjs();
      const start = dayjs(`${nextBlackout.date}T${nextBlackout.startTime}`);
      const diff = start.diff(now, "second");

      if (diff <= 0) {
        setCountdown("⚡ Blackout has started!");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setCountdown(
        `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
          2,
          "0"
        )}m ${String(seconds).padStart(2, "0")}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [nextBlackout]);

  const filteredBlackouts = blackouts.filter((b) => {
    const start = dayjs(`${b.date}T${b.startTime}`);
    return showPast ? true : start.isAfter(dayjs());
  });

  return (
    <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔌 Upcoming Blackouts
      </h2>

      {nextBlackout && !showPast && (
        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500">
          ⚠️ <strong>Next blackout:</strong> {nextBlackout.date} at{" "}
          {nextBlackout.startTime} ({nextBlackout.reason})
          <br />⏳ <strong>Starts in:</strong> {countdown}
        </div>
      )}

      {/* Toggle Button */}
      <div className="text-right mb-4">
        <button
          onClick={() => setShowPast(!showPast)}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {showPast ? "Hide Past Blackouts" : "Show Past Blackouts"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlackouts.map((item, index) => {
            const blackoutStart = dayjs(`${item.date}T${item.startTime}`);
            const isFuture = blackoutStart.isAfter(dayjs());
            const isSelected = selectedBlackoutIndex === index;

            return (
              <Fragment key={index}>
                <tr className="border-b">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">
                    {item.startTime} - {item.endTime}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        item.type === "Planned"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-2">{item.reason}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        setSelectedBlackoutIndex(isSelected ? null : index)
                      }
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                    >
                      {isSelected ? "Close" : "Bid"}
                    </button>
                  </td>
                </tr>

                {/* ⬇ Show Appliance component directly below this blackout row */}
                {isSelected && (
                  <tr className="bg-gray-50">
                    <td colSpan="5">
                      <Appliance
                        blackout={item}
                        onClose={() => setSelectedBlackoutIndex(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {/* ⬇ Add this AFTER the table */}
      {selectedBlackout && (
        <Appliance
          blackout={selectedBlackout}
          onClose={() => setSelectedBlackout(null)}
        />
      )}
    </div>
  );
};

export default BlackoutInfo;
