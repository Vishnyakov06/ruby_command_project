const API_BASE = "http://localhost:3000";

async function getEntity(url) {
    const response = await fetch(`${API_BASE}/${url}`);
    if (!response.ok) throw new Error("Ошибка получения данных");
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

    const json = await response.json();

    if (!response.ok) {
        const error = new Error("Ошибка создания сущности");
        error.response = json;
        throw error;
    }

    return json;
}

async function deleteEntity(id, url) {
    const response = await fetch(`${API_BASE}/${url}/${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        const error = new Error("Ошибка удаления сущности");
        error.response = json;
        throw error;
    }

    return true;
}

async function getEntityById(id, url) {
    const response = await fetch(`${API_BASE}/${url}/${id}`);
    if (!response.ok) throw new Error("Ошибка получения данных");
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

    const json = await response.json();

    if (!response.ok) {
        const error = new Error("Ошибка обновления сущности");
        error.response = json;
        throw error;
    }

    return json;
}

async function createBackup(){
    const response = await fetch('/backups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
    });
    return response.json();
}

async function restoreBackup() {
    const response = await fetch('/backups/restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
    });
        
    return response.json();
}

async function restoreSpecificBackup() {
    const response = await fetch(`/backups/${selectedBackupFilename}/restore`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
    });

    return response.json();
}

async function listBackup() {
    const response = await fetch('/backups');

    return response.json();
}

async function getReport(type, params = {}) {
    const url = new URL(`${API_BASE}/reports/${type}`);
    
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
        throw new Error(`Ошибка получения отчета`);
    }
}
    
async function getUndoHistory() {
    const response = await fetch(`${API_BASE}/undo`, { credentials: 'include' });
    if (!response.ok) throw new Error('Ошибка при получении истории команд');
    return response.json();
}