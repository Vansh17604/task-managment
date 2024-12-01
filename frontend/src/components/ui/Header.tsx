import React, { useState, useEffect } from "react";
import { FaUser, FaSignInAlt } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import SignoutButton from "../SignoutButton"; 

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login") === "true"; 
    setLoggedIn(isLoggedIn);
  }, []);

  // Handle login button
  const handleLogin = () => {
    navigate("/login"); 
  };

  
  const handleProfile = () => {
    navigate("/profile"); 
  };

  return (
    <header className="flex justify-between items-center p-5 bg-blue-600 text-white">
 
      <div className="text-2xl font-semibold">TaskM</div>

     
      <div className="flex items-center space-x-4">

        {loggedIn && (
          <button
            onClick={handleProfile}
            className="flex items-center space-x-2 p-2 bg-blue-700 rounded-md"
          >
            <FaUser />
            <span>Profile</span>
          </button>
        )}

        {/* Login/Logout Button */}
        {loggedIn ? (
          <SignoutButton /> // Show SignOutButton if logged in
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 p-2 bg-blue-700 rounded-md"
          >
            <FaSignInAlt />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
