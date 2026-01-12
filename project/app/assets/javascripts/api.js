const API_BASE = "http://localhost:3000";

async function getClients() {
  const response = await fetch(`${API_BASE}/clients`);
  return response.json();
}

async function getMasters() {
  const response = await fetch(`${API_BASE}/masters`);
  return response.json();
}

async function getServices() {
  const response = await fetch(`${API_BASE}/services`);
  return response.json();
}

async function getBookings() {
  const response = await fetch(`${API_BASE}/bookings`);
  return response.json();
}