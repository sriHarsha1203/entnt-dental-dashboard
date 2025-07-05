import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { getPatients, savePatients } from "../utils/patientStorage";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedList = editingId
      ? patients.map((p) => (p.id === editingId ? { ...form, id: editingId } : p))
      : [...patients, { ...form, id: uuid() }];

    savePatients(updatedList);
    setPatients(updatedList);
    setForm({ name: "", dob: "", contact: "", healthInfo: "" });
    setEditingId(null);
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditingId(patient.id);
  };

  const handleDelete = (id) => {
    const updated = patients.filter((p) => p.id !== id);
    savePatients(updated);
    setPatients(updated);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Patient Management</h2>

        {/* Patient Form */}
        <form onSubmit={handleSubmit} className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            className="border p-2 rounded"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            className="border p-2 rounded"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Health Information"
            className="border p-2 rounded"
            value={form.healthInfo}
            onChange={(e) => setForm({ ...form, healthInfo: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white col-span-1 md:col-span-2 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Patient" : "Add Patient"}
          </button>
        </form>

        {/* Patient List */}
        <h3 className="text-lg font-semibold mb-2">Patient List</h3>
        <table className="w-full table-auto border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Health Info</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.dob}</td>
                <td className="border p-2">{p.contact}</td>
                <td className="border p-2">{p.healthInfo}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-yellow-500 px-2 py-1 text-white rounded"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 text-white rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/patients/${p.id}/incidents`}
                    className="bg-green-600 px-2 py-1 text-white rounded inline-block"
                  >
                    View Records
                  </Link>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No patients added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
