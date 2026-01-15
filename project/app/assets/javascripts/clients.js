let selectedClientId = null;

async function loadClients() {
    try {
        const clients = await getClients();

        const tbody = document.getElementById("clients-table-body");
        if (!tbody) {
            console.error("clients-table-body не найден");
            return;
        }

        tbody.innerHTML = "";

        if (!clients.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">Клиентов нет</td>
                </tr>
            `;
            return;
        }

        clients.forEach(client => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr class="client-row" data-id="${client.client_id}">
                    <td style="text-align: center">${client.client_id}</td>
                    <td style="text-align: center">${client.last_name ?? " "}</td>
                    <td style="text-align: center">${client.first_name ?? " "}</td>
                    <td style="text-align: center">${client.patronymic ?? " "}</td>
                    <td style="text-align: center">${client.phone_number ?? " "}</td>
                    <td style="text-align: center">${formatDate(client.registration_date)}</td>
                </tr>
            `);
        });

    } catch (error) {
        console.error("Ошибка загрузки клиентов:", error);
    }
}

document.addEventListener("click", (e) => {
    const row = e.target.closest(".client-row");

    if (!row) {
        clearClientSelection();
        return;
    }

    if (row.classList.contains("active")) {
        clearClientSelection();
        return;
    }

    selectClientRow(row);
});

function selectClientRow(row) {
    clearClientSelection();
    row.classList.add("active");
    selectedClientId = row.dataset.id;
    document.getElementById("edit-client-btn").classList.remove("hidden");
    document.getElementById("delete-client-btn").classList.remove("hidden");
}

function clearClientSelection() {
    document.querySelectorAll(".client-row.active").forEach(r => r.classList.remove("active"));
    selectedClientId = null;
    document.getElementById("edit-client-btn").classList.add("hidden");
    document.getElementById("delete-client-btn").classList.add("hidden");
}


document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#client-form")) return;

    e.preventDefault();

    const payload = {
        client: {
            first_name: document.getElementById("client-firstname").value,
            last_name: document.getElementById("client-lastname").value,
            patronymic: document.getElementById("client-patronymic").value,
            phone_number: document.getElementById("client-phone-number").value
        }
    };

    try {
        await createClient(payload);
        closeModal(document.getElementById("client-modal"));
        await loadClients();
        e.target.reset();

    } catch (error) {
        console.error(error);
        throw new Error("Не удалось создать клиента");
    }
});

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ru-RU");
}

window.loadClients = loadClients;
