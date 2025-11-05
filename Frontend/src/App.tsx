// App.jsx - Main component with routing
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EmployeeInfoPage from "./components/EmployeeInfoPage";
import EmployeeListPage from "./components/EmployeeListPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const API_URL = "http://192.168.137.1:3000";

  return (
    <AuthProvider baseUrl={API_URL}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/employee-info" element={
                <ProtectedRoute>
                  <EmployeeInfoPage />
                </ProtectedRoute>
              } />
              <Route path="/employee-list" element={
                <ProtectedRoute>
                  <EmployeeListPage />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected route component to handle authentication
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("currentUser") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;




// components/Input.jsx - Reused from original code
// This component should remain unchanged