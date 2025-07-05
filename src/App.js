import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import PatientLogin from "./pages/PatientLogin";
import Dashboard from "./pages/Dashboard";
import MyRecords from "./pages/MyRecords";
import Patients from "./pages/Patients";
import IncidentManager from "./pages/IncidentManager";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="Admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute role="Admin">
                <Patients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId/incidents"
            element={
              <ProtectedRoute role="Admin">
                <IncidentManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-records"
            element={
              <ProtectedRoute role="Patient">
                <MyRecords />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId/incidents"
            element={
            <ProtectedRoute role="Admin">
      <IncidentManager />
    </ProtectedRoute>
  }
/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
