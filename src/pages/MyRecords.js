import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getIncidents } from "../utils/incidentStorage";
import dayjs from "dayjs";

export default function MyRecords() {
  const { user } = useAuth();
  const [myIncidents, setMyIncidents] = useState([]);

  useEffect(() => {
    if (user?.role === "Patient") {
      const all = getIncidents();
      const filtered = all.filter((i) => i.patientId === user.patientId);
      setMyIncidents(filtered);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Appointments & History</h2>

        {myIncidents.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {myIncidents.map((incident) => (
              <li key={incident.id} className="border rounded p-4">
                <div className="mb-2">
                  <p><strong>Title:</strong> {incident.title}</p>
                  <p><strong>Appointment Date:</strong> {dayjs(incident.appointmentDate).format("YYYY-MM-DD HH:mm")}</p>
                  <p><strong>Treatment:</strong> {incident.treatment || "N/A"}</p>
                  <p><strong>Status:</strong> <span className={`font-semibold ${incident.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>{incident.status || "N/A"}</span></p>
                  <p><strong>Cost:</strong> ₹{incident.cost || "N/A"}</p>
                  <p><strong>Next Visit:</strong> {incident.nextDate || "N/A"}</p>
                  <p><strong>Comments:</strong> {incident.comments || "None"}</p>
                </div>

                {/* File previews */}
                {incident.files && incident.files.length > 0 && (
                  <div className="mt-2">
                    <strong>Files:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {incident.files.map((file, idx) => (
                        <div key={idx} className="border rounded p-2">
                          <p className="text-sm font-medium">{file.name}</p>
                          {file.url.startsWith("data:image") ? (
                            <img src={file.url} alt={file.name} className="w-32 h-auto rounded mt-1" />
                          ) : (
                            <a
                              href={file.url}
                              download={file.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
