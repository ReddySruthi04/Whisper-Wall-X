// context/AuthContext.jsx - Context for authentication state
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, baseUrl }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuspicious, setIsSuspicious] = useState(false);

  useEffect(() => {
    // Check for saved user on initial load
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (loginData) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Login successful");
        setCurrentUser(data.data);
        setIsSuspicious(data.suspicious || false);
        localStorage.setItem("currentUser", JSON.stringify(data.data));
        return { success: true, message: data.message };
      } else {
        setMessage(data.error || "Login failed");
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (error) {
      setMessage("Login failed - server error");
      return { success: false, message: "Login failed - server error" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Registration successful");
        return { success: true, message: data.message };
      } else {
        setMessage(data.error || "Registration failed");
        return { success: false, message: data.error || "Registration failed" };
      }
    } catch (error) {
      setMessage("Registration failed - server error");
      return { success: false, message: "Registration failed - server error" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsSuspicious(false);
    setMessage("");
    localStorage.removeItem("currentUser");
  };

  const updateEmployeeInfo = async (employeeData) => {
    if (!currentUser) return { success: false, message: "Not logged in" };

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/employee-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          employeeData: employeeData,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          ...currentUser,
          employeeData: data.data,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        return {
          success: true,
          message: data.message || "Employee information updated",
        };
      } else {
        return {
          success: false,
          message: data.error || "Failed to update employee information",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Server error while updating employee information",
      };
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch all employees (mock implementation)
  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/employees`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        return { success: true, data: data.employees };
      } else {
        return {
          success: false,
          message: data.error || "Failed to fetch employees",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Server error while fetching employees",
      };
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async () => {
    if (!currentUser) {
      return { success: false, message: "User not logged in" };
    }
    try {
      // Fetch geolocation (optional - implement as needed)
      const location = "User's current location"; // Replace with real geolocation logic
      const response = await fetch(`${baseUrl}/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          email: currentUser.email,
          metadata: {
            ...currentUser.employeeData, // Include employee details as metadata
          },
          location,
        }),
      });
      if (response.ok) {
        return { success: true, message: "Alert sent successfully" };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || "Failed to send alert",
        };
      }
    } catch (error) {
      return { success: false, message: "Error sending alert" };
    }
  };

  // Add `sendAlert` to the AuthContext value:
  const value = {
    currentUser,
    loading,
    message,
    isSuspicious,
    login,
    register,
    logout,
    updateEmployeeInfo,
    fetchAllEmployees,
    sendAlert, // Add this line
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
