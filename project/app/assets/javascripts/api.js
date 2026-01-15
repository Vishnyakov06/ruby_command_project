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

async function createClient(data) {
    const response = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания клиента");
    }

    return response.json();
}

async function createMaster(data) {
    const response = await fetch(`${API_BASE}/masters`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания мастера");
    }

    return response.json();
}

async function createService(data) {
    const response = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания услуги");
    }

    return response.json();
}

async function createBooking(data) {
    const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания записи");
    }

    return response.json();
}

async function deleteClient(id) {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        throw new Error("Ошибка удаления клиента");
    }
}

async function deleteMaster(id) {
    const response = await fetch(`${API_BASE}/masters/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        throw new Error("Ошибка удаления мастера");
    }
}

async function deleteService(id) {
    const response = await fetch(`${API_BASE}/services/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        throw new Error("Ошибка удаления услуги");
    }
}

async function deleteBooking(id) {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        throw new Error("Ошибка удалени записи");
    }
}