
// components/Navbar.jsx - Navigation component
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-1">
            <Link to="/" className="text-xl font-bold">WhisperWall X</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="hidden md:inline text-sm text-gray-300">
                  Welcome, {currentUser.name}
                </span>
                <Link to="/employee-info" className="px-3 py-2 rounded hover:bg-gray-700">
                  My Profile
                </Link>
                <Link to="/employee-list" className="px-3 py-2 rounded hover:bg-gray-700">
                  Employee Directory
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-700">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;