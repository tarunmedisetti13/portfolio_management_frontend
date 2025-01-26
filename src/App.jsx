import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PortfolioDetails from "./components/PortfolioDetails";
import PortfolioList from "./components/PortfolioList"; // Import PortfolioList
import Navbar from "./components/Navbar";
import ForgotPassword from "./components/ForgotPassword";
import MarketInsights from "./components/MarketInsights";

const App = () => {
  const location = useLocation();

  // Check if the user is logged in (you can adjust this based on your authentication method)
  const isLoggedIn = localStorage.getItem("authToken");

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/", "/login", "/signup", "/forgot-password"];

  return (
    <div className="page-content">
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && isLoggedIn && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes (Only visible if logged in) */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/market-insights"
          element={isLoggedIn ? <MarketInsights /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolios"
          element={isLoggedIn ? <PortfolioList /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio/:portfolioId"
          element={isLoggedIn ? <PortfolioDetails /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
