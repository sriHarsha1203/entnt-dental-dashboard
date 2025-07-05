import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Dental_Logo.jpg"; 

export default function PatientLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(email, password);
    if (!user) {
      setError("Invalid credentials");
    } else if (user.role !== "Patient") {
      setError("Access denied: You are not a Patient");
    } else {
      navigate("/my-records");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded shadow w-80 space-y-4">
        <div className="flex justify-center">
          <img src={logo} alt="Clinic Logo" className="w-24 h-24 object-contain mb-2" />
        </div>
        <h2 className="text-xl font-bold text-center text-green-700">Patient Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="border w-full px-3 py-2 rounded"
            placeholder="Patient Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="border w-full px-3 py-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
