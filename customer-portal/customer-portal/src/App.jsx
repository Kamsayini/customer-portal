import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NotificationListener from "./components/NotificationListener";

function AppContent() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <AppRoutes />
      {token && <NotificationListener token={token} />} {/* ✅ Real-time listener */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
