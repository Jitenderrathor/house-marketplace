import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Category from "./pages/Category";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Explore/>}/>
      <Route path="/offers" element={<Offers/>}/>
      <Route path="/category/:categoryName" element={<Category/>}/>
      <Route path="/category/:categoryName/:listingId" element={<Listing/>}/>
      <Route path="/profile" element={<PrivateRoute/>}>
      <Route path="/profile" element={<Profile/>}/>
      </Route>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<SignUp/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/create-listing" element={<CreateListing/>}/>
      <Route path="/edit-listing/:listingId" element={<EditListing/>}/>
      <Route path="/contact/:landLordId" element={<Contact/>}/>
    </Routes>
    <Navbar/>
    <ToastContainer/>
   </Router>
  )
}

export default App;