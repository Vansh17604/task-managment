import { useAppContext } from "../../context/AppContext";
import { FaUser, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import SignoutButton from "../SignoutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
      <div className="text-3xl font-extrabold tracking-wider">
        <Link to="/">TaskM</Link>
      </div>

      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-3 bg-blue-800 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              <FaUser className="text-xl" />
              <span className="text-lg">Profile</span>
            </Link>
            <SignoutButton />
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-2 p-3 bg-blue-800 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            <FaSignInAlt className="text-xl" />
            <span className="text-lg">Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
