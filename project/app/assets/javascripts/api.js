const API_BASE = "http://localhost:3000";

async function getEntity(url) {
    const response = await fetch(`${API_BASE}/${url}`);
    return response.json();
}

async function createEntity(data, url) {
    const response = await fetch(`${API_BASE}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания сущности");
    }

    return response.json();
}

async function deleteEntity(id, url) {
    const response = await fetch(`${API_BASE}/${url}/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        throw new Error("Ошибка удаления сущности");
    }
}

async function getEntityById(id, url) {
    const response = await fetch(`${API_BASE}/${url}/${id}`);
    return response.json();
}

async function updateEntity(id, data, url) {
    const response = await fetch(`${API_BASE}/${url}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка изменения сущности");
    }

    return response.json();
}

async function getUndoHistory() {
    const response = await fetch(`${API_BASE}/undo`, { credentials: 'include' });
    if (!response.ok) throw new Error('Ошибка при получении истории команд');
    return response.json();
}