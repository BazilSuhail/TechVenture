import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const SignIn = lazy(() => import("./Components/Signin"));
const AdminDashboard = lazy(() => import("./Components/Admin/AdminDashboard"));
const Addspecification = lazy(() => import("./Components/Admin/Addspecification"));
const Signup = lazy(() => import("./Components/Signup"));
const ClientProducts = lazy(() => import("./Components/Gadgets/ClientProducts"));
const ProductSpecifications = lazy(() => import("./Components/Gadgets/Product_specifications"));
const ManageReview = lazy(() => import("./Components/ManageReiews/ManageReview"));
const SearchProjects = lazy(() => import("./Components/Gadgets/SearchProducts"));
const HomePage = lazy(() => import("./Components/Home"));
const MyProfile = lazy(() => import("./Components/Profile/MyProfile"));
const TechToday = lazy(() => import("./Components/TechToday"));

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Suspense fallback={<div></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/techtoday" element={<TechToday />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/products" element={<ClientProducts />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/product-specifications/:productId" element={<ProductSpecifications />} />
              <Route path="/add-specifications/:productId" element={<Addspecification />} />
              <Route path="/searchprojects" element={<SearchProjects />} />
              <Route path="/manage-reviews/:productId" element={<ManageReview />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
