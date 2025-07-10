import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-lg p-4 text-gray-800 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        BUY/SELL @IIIT
      </h1>
      
      <div className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
        >
          Home
        </Link>
        
        {user ? (
          <>
            <Link 
              to="/products" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Products
            </Link>
            <Link 
              to="/my-products" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              My Products
            </Link>
            <Link 
              to="/my-orders" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              My Orders
            </Link>
            <Link 
              to="/profile" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Profile
            </Link>
            <Link 
              to="/delivery" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Delivery
            </Link>
            <Link 
              to="/cart" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              My Cart
            </Link>
            <button 
              onClick={logout} 
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="relative px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
