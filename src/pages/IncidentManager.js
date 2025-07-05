import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatients } from "../utils/patientStorage";
import { getIncidents, saveIncidents } from "../utils/incidentStorage";
import { v4 as uuid } from "uuid";
import Navbar from "../components/Navbar";

export default function IncidentManager() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    treatment: "",
    status: "",
    nextDate: "",
    files: []
  });

  useEffect(() => {
    const patients = getPatients();
    const found = patients.find((p) => p.id === patientId);
    setPatient(found);

    const all = getIncidents();
    const filtered = all.filter((i) => i.patientId === patientId);
    setIncidents(filtered);
  }, [patientId]);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          url: event.target.result
        };
        setForm((prev) => ({
          ...prev,
          files: [...prev.files, fileData]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const all = getIncidents();
    const updated = editingId
      ? all.map((i) => (i.id === editingId ? { ...form, id: editingId, patientId } : i))
      : [...all, { ...form, id: uuid(), patientId }];

    saveIncidents(updated);
    setIncidents(updated.filter((i) => i.patientId === patientId));
    setForm({
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "",
      nextDate: "",
      files: []
    });
    setEditingId(null);
  };

  const handleEdit = (incident) => {
    setForm(incident);
    setEditingId(incident.id);
  };

  const handleDelete = (id) => {
    const updated = getIncidents().filter((i) => i.id !== id);
    saveIncidents(updated);
    setIncidents(updated.filter((i) => i.patientId === patientId));
  };

  const removeFile = (fileIndex) => {
    const newFiles = form.files.filter((_, i) => i !== fileIndex);
    setForm({ ...form, files: newFiles });
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Incidents for {patient?.name}
        </h2>

        {/* Incident Form */}
        <form onSubmit={handleSubmit} className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-6">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Comments"
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={form.appointmentDate}
            onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
            required
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Cost (₹)"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Treatment"
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Status (Completed or Pending)"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={form.nextDate}
            onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
          />
          <input
            type="file"
            multiple
            className="col-span-2 border p-2 rounded"
            onChange={handleFileUpload}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white col-span-2 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Incident" : "Add Incident"}
          </button>
        </form>

        {/* File Previews */}
        {form.files.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Uploaded Files:</h4>
            <div className="flex flex-wrap gap-3">
              {form.files.map((f, i) => (
                <div key={i} className="border p-2 rounded relative">
                  <p className="text-sm mb-1">{f.name}</p>
                  {f.url.startsWith("data:image") ? (
                    <img src={f.url} alt="Preview" className="w-28 h-auto rounded" />
                  ) : (
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View File
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-0 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incident List */}
        <h3 className="text-lg font-bold mb-2">Appointment History</h3>
        <table className="w-full table-auto border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr key={i.id}>
                <td className="border p-2">{i.title}</td>
                <td className="border p-2">{i.appointmentDate}</td>
                <td className="border p-2">₹{i.cost}</td>
                <td className="border p-2">{i.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                    onClick={() => handleEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 text-white rounded"
                    onClick={() => handleDelete(i.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {incidents.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No incidents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
