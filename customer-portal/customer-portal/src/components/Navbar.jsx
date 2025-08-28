import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
// import { signInWithGoogle, logout } from "../config/firebase";
import Logout from "./Logout";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">⚡ AI Microgrid</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-lg">
                <FaUser className="text-yellow-300" /> {user.displayName}
              </span>
              <button
        
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaSignOutAlt /> Login
              </button>
            </>
          ) : (
            <Logout /> 
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
