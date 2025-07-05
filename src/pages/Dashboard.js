// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { getIncidents } from "../utils/incidentStorage";
import { getPatients } from "../utils/patientStorage";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setIncidents(getIncidents());
    setPatients(getPatients());
  }, []);

  const totalAppointments = incidents.length;
  const completed = incidents.filter(i => i.status === "Completed").length;
  const pending = incidents.filter(i => i.status === "Pending").length;
  const revenue = incidents.reduce((sum, i) => sum + (i.cost || 0), 0);

  const patientCount = {};
  incidents.forEach(i => {
    patientCount[i.patientId] = (patientCount[i.patientId] || 0) + 1;
  });

  const topPatients = Object.entries(patientCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => {
      const patient = patients.find(p => p.id === id);
      return {
        name: patient?.name || "Unknown",
        count
      };
    });

  const now = new Date();
  const upcoming = incidents
    .filter(i => new Date(i.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-gray-600">Total Appointments</p>
            <h2 className="text-xl font-bold">{totalAppointments}</h2>
          </div>
          <div className="bg-green-100 rounded shadow p-4 text-center">
            <p className="text-gray-600">Completed</p>
            <h2 className="text-xl font-bold">{completed}</h2>
          </div>
          <div className="bg-yellow-100 rounded shadow p-4 text-center">
            <p className="text-gray-600">Pending</p>
            <h2 className="text-xl font-bold">{pending}</h2>
          </div>
          <div className="bg-blue-100 rounded shadow p-4 text-center">
            <p className="text-gray-600">Total Revenue</p>
            <h2 className="text-xl font-bold">₹{revenue}</h2>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Top Patients</h3>
          <ul className="list-disc list-inside">
            {topPatients.map((p, idx) => (
              <li key={idx}>{p.name} — {p.count} appointments</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Next 10 Appointments</h3>
          <ul className="space-y-2">
            {upcoming.map((i) => {
              const patient = patients.find(p => p.id === i.patientId);
              const patientName = patient ? patient.name : "Unknown";

              return (
                <li key={i.id} className="border p-2 rounded bg-white shadow-sm">
                  <strong>{patientName}</strong> — <span className="font-semibold">{i.title}</span> — {new Date(i.appointmentDate).toLocaleString()}
                </li>
              );
            })}
            {upcoming.length === 0 && <p>No upcoming appointments.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
