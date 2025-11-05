
// pages/RegisterPage.jsx - Registration page component
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(registerData);
    
    setMessage({
      text: result.message,
      isError: !result.success
    });
    
    if (result.success) {
      // Clear form after successful registration
      setRegisterData({
        username: "",
        email: "",
        name: "",
        password: "",
      });
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register for WhisperWall X</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Full Name"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          
          {message.text && (
            <div className={`text-center text-sm mt-4 p-2 rounded ${
              message.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

