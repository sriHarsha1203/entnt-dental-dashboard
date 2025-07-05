export const getIncidents = () =>
  JSON.parse(localStorage.getItem("incidents")) || [];

export const saveIncidents = (incidents) =>
  localStorage.setItem("incidents", JSON.stringify(incidents));
