import { useState } from "react";

const BillingHistory = () => {
  const [bills] = useState([
    { month: "January", amount: 45.23, status: "Paid" },
    { month: "February", amount: 50.75, status: "Paid" },
    { month: "March", amount: 55.60, status: "Unpaid" },
  ]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Month</th>
            <th className="p-3 text-left">Amount ($)</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{bill.month}</td>
              <td className="p-3">${bill.amount.toFixed(2)}</td>
              <td className={`p-3 font-bold ${bill.status === "Paid" ? "text-green-500" : "text-red-500"}`}>
                {bill.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistory;
