import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//const Admin = React.lazy(() => import("./Components/Admin"));
import Navbar from "./Components/Navbar";
import SignIn from "./Components/Signin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Signup from "./Components/Signup";
import ClientProducts from "./Components/ClientProducts";
import ProductSpecifications from "./Components/Product_specifications";
import AddSpecification from "./Components/Addspecification";
import ManageReview from "./Components/ManageReiews/ManageReview";
import SearchProjects from "./Components/SearchProducts";
import HomePage from "./Components/Home";
import MyProfile from "./Components/Profile/MyProfile";
import TechToday from "./Components/TechToday";

const App = () => {

  return ( 

      <Router>
        <Navbar />
        <Routes>
          {/*  <Route path="/" element={<Loader typeOfloader="a" />} />*/} 

          <Route path="/" element={<HomePage />} />
          <Route path="/techtoday" element={<TechToday />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/products" element={<ClientProducts />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/product-specifications/:productId" element={<ProductSpecifications />} />
          <Route path="/add-specifications/:productId" element={<AddSpecification />} />
          <Route path="/searchprojects" element={<SearchProjects />} />
          <Route path="/manage-reviews/:productId" element={<ManageReview />} />

        </Routes>


      </Router> 
  );
};

export default App;