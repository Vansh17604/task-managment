import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { EditBoard } from "./page/EditBord";
import { Profile } from "./page/Profile";
import { EditProfile } from "./page/EditProfile";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";


const App = () => {
 

  return (
    <Router>
      <Routes>
        
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/edit-board/:boardId" element={<EditBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
         
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          
      </Routes>
    </Router>
  );
};

export default App;
