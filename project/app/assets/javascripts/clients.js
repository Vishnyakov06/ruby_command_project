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
    document.getElementById("edit-client-btn")?.classList.add("hidden");
    document.getElementById("delete-client-btn")?.classList.add("hidden");
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ru-RU");
}

function populateClientDelete() {
    const detailsContainer = document.getElementById("delete-client-details");
    if (!detailsContainer) return;
    console.log(selectedClientId)
    if (!selectedClientId) {
        detailsContainer.innerHTML = "<p>Клиент не выбран</p>";
        return;
    }

    const row = document.querySelector(`.client-row[data-id="${selectedClientId}"]`);
    if (!row) {
        detailsContainer.innerHTML = "<p>Клиент не найден</p>";
        return;
    }

    const cells = row.children;
    detailsContainer.innerHTML = `
        <p><strong>Фамилия И. О.:</strong> ${
            cells[1].textContent + " " + 
            cells[2].textContent[0] + "." + " " + 
            cells[3].textContent[0] + "."
        }</p>
        <p><strong>Телефон:</strong> ${cells[4].textContent}</p>
    `;
}

async function searchClientById(id) {
    const resultsDiv = document.getElementById("client-search-results");
    const detailsDiv = document.getElementById("client-result-details");
    
    await getClientById(id)
        .then(client => {
            const registrationDate = client.registration_date 
                ? formatDate(client.registration_date) 
                : "—";
            
            detailsDiv.innerHTML = `
                <p><strong>Фамилия И. О.:</strong> ${
                    client.last_name + " " + 
                    client.first_name[0] + "." + " " + 
                    client.patronymic[0] + "."
                }</p>
                <p><strong>Телефон:</strong> ${client.phone_number || "—"}</p>
                <p><strong>Дата регистрации:</strong> ${registrationDate}</p>
            `;
            resultsDiv.style.display = 'block';
        })
        .catch(error => {
            resultsDiv.style.display = 'block';
        });
}

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#search-client-form")) return;
    
    e.preventDefault();
    
    const clientId = document.getElementById("search-client-id").value.trim();
    await searchClientById(clientId);
});

document.getElementById("confirm-delete-client")?.addEventListener("click", async () => {
    if (!selectedClientId) return;

    try {
        await deleteClient(selectedClientId);
        closeModal(document.getElementById("delete-client-modal"));
        await loadClients();
        clearClientSelection();
    } catch (error) {
        throw new Error("Не удалось удалить клиента");
    }
});

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
        throw new Error("Не удалось создать клиента");
    }
});

document.addEventListener("click", (e) => {
    const row = e.target.closest(".client-row");

    if (!row) return;

    if (row.classList.contains("active")) {
        clearClientSelection();
    } else {
        selectClientRow(row);
    }
});

window.loadClients = loadClients;
