export const getPatients = () =>
  JSON.parse(localStorage.getItem("patients")) || [];

export const savePatients = (patients) =>
  localStorage.setItem("patients", JSON.stringify(patients));
