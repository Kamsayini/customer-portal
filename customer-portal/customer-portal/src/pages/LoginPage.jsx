import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { registerUser, loginUser } from "../api/authService"; 

const LoginPage = () => {
  const { user, login } = useAuth(); // ✅ now you have access to the login() method
  const navigate = useNavigate();
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");


  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleAuth = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    if (isSignUp) {
  await registerUser(username, email, password, referenceNumber);
  // ✅ Registration successful, no auto-login
  alert("Registration successful! Please sign in.");
  setIsSignUp(false); // Switch to sign-in mode
  setEmail("");
  setPassword("");
  setUsername("");
  setReferenceNumber("");
}
else {
      const data = await loginUser(email, password); // ✅ Login call
      login(data.user, data.token);   
      navigate("/dashboard");               // ✅ Save in context
    }

     // ✅ Move here so it doesn't get called twice
  } catch (err) {
    setError(
      err.message.includes("auth/email-already-in-use")
        ? "Email already in use"
        : err.message.includes("auth/invalid-credential") ||
          err.message.includes("auth/user-not-found")
        ? "Invalid email or password"
        : "Something went wrong"
    );
  }

  setLoading(false);

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {isSignUp ? "Sign up to get started" : "Sign in to continue"}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">

          {isSignUp && (
  <input
    type="text"
    placeholder="Username"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
  />
)}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignUp && (
  <input
    type="text"
    placeholder="Reference Number"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={referenceNumber}
    onChange={(e) => setReferenceNumber(e.target.value)}
    required
  />
)}



          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

      

        <p className="text-gray-500 text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
