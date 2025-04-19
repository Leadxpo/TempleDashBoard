import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Orders from "./pages/Users";
import OrderData from "./pages/orderdata";
import PaymentsRecords from "./pages/paymentrecords";
import Layout from "./pages/layout";
import MoreDetails from "./pages/MoreDetails";
import BlockedNumber from "./pages/BlockedNumbers";



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/"
            element={
              <Layout
                onLogout={handleLogout}
                toggleSidebar={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="moredetails" element={<MoreDetails />} />
            <Route path="users" element={<Orders />} />
            <Route path="order-data" element={<OrderData />} />
            <Route path="payments" element={<PaymentsRecords />} />
            <Route path="blockednumbers" element={<BlockedNumber />} />
            <Route path="profile" element={<Profile />} />
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          // Catch all unauthorized routes and redirect to login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
