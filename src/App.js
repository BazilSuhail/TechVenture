import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//const Admin = React.lazy(() => import("./Components/Admin"));
import Navbar from "./Components/Navbar";  
import SignIn from "./Components/Signin";
import AdminDashboard from "./Components/AdminDashboard";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import Products from "./Components/Products";
import ProductSpecifications from "./Components/Product_specifications";
import AddSpecification from "./Components/Addspecification";
import ManageReviews from "./Components/ManageReviews";

const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        {/*  <Route path="/" element={<Loader typeOfloader="a" />} />*/}
        <Route path="/asasas" element={<SignIn />} />
         
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product-specifications/:productId" element={<ProductSpecifications />} />
        <Route path="/add-specifications/:productId" element={<AddSpecification />} />
        <Route path="/manage-reviews/:productId" element={<ManageReviews />} />

      </Routes>


    </Router>
  );
};

export default App;