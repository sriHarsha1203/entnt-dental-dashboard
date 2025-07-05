import { Link } from "react-router-dom";
import background from "../assets/Dental_Home1.jpeg"; 

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
      style={{
        backgroundImage: `url(${background})`,
        backdropFilter: "brightness(0.7)"
      }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded shadow-md text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Welcome to ENTNT Dental Dashboard</h1>

        <div className="space-x-4">
          <Link
            to="/admin-login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
          >
            Admin Login
          </Link>
          <Link
            to="/patient-login"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
          >
            Patient Login
          </Link>
        </div>
      </div>
    </div>
  );
}
