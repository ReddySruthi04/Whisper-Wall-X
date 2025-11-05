import React, { useState, useEffect } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import useShakeDetection from "../hooks/useShakeDetection";
import useGestureRecognition from "../hooks/useGestureRecognition";

function EmployeeInfoPage() {
  const {
    currentUser,
    updateEmployeeInfo,
    loading,
    sendAlert, // Import from AuthContext
  } = useAuth();
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    department: "",
    position: "",
    salary: "",
    hireDate: "",
    performance: "",
  });

  // Pre-populate form if user has employee data
  useEffect(() => {
    if (currentUser?.employeeData) {
      setEmployeeData(currentUser.employeeData);
    }
  }, [currentUser]);

  const enableSilentMode = () => {
    setIsSilentMode(true);
    navigator.vibrate(500); // Vibrate the device briefly to indicate silent mode
    console.log("Phone set to silent mode.");
  };
  // Function to send an alert to cybercrime authorities

  useShakeDetection(() => {
    sendAlert().then((result) => {
      setMessage({
        text: result.message,
        isError: !result.success,
      });
    });
    enableSilentMode(); // Keep this for silent mode activation
  });

  // Handle gesture detection
  useGestureRecognition(() => {
    sendAlert().then((result) => {
      setMessage({
        text: result.message,
        isError: !result.success,
      });
    });
    enableSilentMode();
  });
  // Handle form submission
  const handleEmployeeDataSubmit = async (e) => {
    e.preventDefault();
    const result = await updateEmployeeInfo(employeeData);

    setMessage({
      text: result.message,
      isError: !result.success,
    });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Employee Information
        </h2>

        {currentUser ? (
          <>
            {/* User Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Username:</div>
                <div className="font-medium">{currentUser.username}</div>
                <div>Email:</div>
                <div className="font-medium">{currentUser.email}</div>
                <div>Name:</div>
                <div className="font-medium">{currentUser.name}</div>
              </div>
            </div>

            {/* Current Employee Details Section */}
            {currentUser.employeeData &&
              Object.keys(currentUser.employeeData).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Current Employee Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Employee ID:</div>
                    <div className="font-medium">
                      {currentUser.employeeData.employeeId}
                    </div>
                    <div>Department:</div>
                    <div className="font-medium">
                      {currentUser.employeeData.department}
                    </div>
                    <div>Position:</div>
                    <div className="font-medium">
                      {currentUser.employeeData.position}
                    </div>
                    <div>Salary:</div>
                    <div className="font-medium">
                      ${currentUser.employeeData.salary}
                    </div>
                    <div>Hire Date:</div>
                    <div className="font-medium">
                      {currentUser.employeeData.hireDate}
                    </div>
                    <div>Performance:</div>
                    <div className="font-medium">
                      {currentUser.employeeData.performance}
                    </div>
                  </div>
                </div>
              )}

            {/* Update Employee Information Form */}
            <form
              onSubmit={handleEmployeeDataSubmit}
              className="space-y-3 mt-4"
            >
              <h4 className="font-medium mb-2">Update Employee Information</h4>
              <Input
                type="text"
                placeholder="Employee ID"
                value={employeeData.employeeId}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeId: e.target.value,
                  })
                }
                required
              />
              <Input
                type="text"
                placeholder="Department"
                value={employeeData.department}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    department: e.target.value,
                  })
                }
                required
              />
              <Input
                type="text"
                placeholder="Position"
                value={employeeData.position}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, position: e.target.value })
                }
                required
              />
              <Input
                type="number"
                placeholder="Salary"
                value={employeeData.salary}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, salary: e.target.value })
                }
                required
              />
              <Input
                type="date"
                placeholder="Hire Date"
                value={employeeData.hireDate}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, hireDate: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="Performance"
                value={employeeData.performance}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    performance: e.target.value,
                  })
                }
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Employee Info"}
              </Button>
            </form>

            {/* Alert Message Display */}
            {message.text && (
              <div
                className={`text-center text-sm mt-4 p-2 rounded ${
                  message.isError
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Silent Mode Notification */}
            {isSilentMode && (
              <div className="text-center text-sm mt-4 p-2 rounded bg-yellow-50 text-yellow-600">
                Silent mode activated. An alert has been sent to cybercrime
                authorities.
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-red-600">
            You must be logged in to view this page.
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeInfoPage;
