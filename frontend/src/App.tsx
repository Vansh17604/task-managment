import {
  BrowserRouter as Router,
  Route,
  Routes,
  
} from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { EditBoard } from "./page/EditBord";
import { Profile } from "./page/Profile";



const App = () => {
 
  return (
    <Router>
      <Routes>
       <Route path="/login" element={<Login></Login>}></Route>
       <Route path="/register" element={<Register></Register>}></Route>
       <Route path="/" element={<><Header /><Home></Home><Footer /></>}></Route>
       <Route path="/edit-board/:boardId" element={<EditBoard />} />
       <Route path="/profile" element={<Profile />} /> 

       
      </Routes>
    </Router>
  );
};

export default App;