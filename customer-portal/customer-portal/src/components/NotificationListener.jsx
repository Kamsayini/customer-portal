import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const NotificationListener = ({ token }) => {
  useEffect(() => {
    console.log("🪪 Using token for SignalR:", token); 
       const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log("🧾 JWT userId (sub):", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

    // ✅ Establish SignalR connection// ✅ Log token before connection starts

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5081/allocationHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

      
connection.on("ReceiveAllocation", (data) => {
  const { blockSize, bidAmount } = data;
  console.log("🔔 Allocation received:", data);
  alert(`✅ You've been allocated ${blockSize} kWh for RS.${bidAmount}`);
});




    connection
      .start()
      .then(() => {
        console.log("✅ SignalR connection started"); // ✅ Log success
      })
      .catch((err) => {
        console.error("❌ SignalR connection error:", err); // ❌ Log failure
      });

    // Optional cleanup on component unmount
    return () => {
      connection.stop();
    };
  }, [token]);

  return null;
};

export default NotificationListener;
