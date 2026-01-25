let selectedMasterId = null;

async function loadMasters() {
    try {
        const masters = await getEntity('masters');
        const tbody = document.getElementById("masters-table-body");
        if (!tbody) {
            return;
        }

        tbody.innerHTML = "";

        if (!masters.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;"><strong>Мастеров нет</strong></td>
            </tr>
        `;
        return;
        }

        masters.forEach(master => {
        tbody.insertAdjacentHTML("beforeend", `
            <tr class="master-row" data-id="${master.master_id}">
                <td style="text-align: center">${master.master_id}</td>
                <td style="text-align: center">${master.last_name ?? " "}</td>
                <td style="text-align: center">${master.first_name ?? " "}</td>
                <td style="text-align: center">${master.patronymic ?? " "}</td>
                <td style="text-align: center">${master.phone_number ?? " "}</td>
                <td style="text-align: center">${getActiveStatus(master.is_active)}</td>
            </tr>
        `);
        });

    } catch (error) {
        console.error("Ошибка загрузки мастеров:", error);
    }
}

function selectMasterRow(row) {
    clearMasterSelection();
    row.classList.add("active");
    selectedMasterId = row.dataset.id;
    console.log(selectedMasterId)
    document.getElementById("edit-master-btn").classList.remove("hidden");
    document.getElementById("delete-master-btn").classList.remove("hidden");
}

function clearMasterSelection() {
    document.querySelectorAll(".master-row.active").forEach(r => r.classList.remove("active"));
    selectedMasterId = null;
    document.getElementById("edit-master-btn")?.classList.add("hidden");
    document.getElementById("delete-master-btn")?.classList.add("hidden");
}

function getActiveStatus(isActive) {
    return isActive ? "Активен" : "Не активен";
}

function populateMasterDelete() {
    const detailsContainer = document.getElementById("delete-master-details");
    if (!detailsContainer) return;

    if (!selectedMasterId) {
        detailsContainer.innerHTML = "<p>пизда</p>";
        return;
    }

    const row = document.querySelector(`.master-row[data-id="${selectedMasterId}"]`);
    if (!row) {
        detailsContainer.innerHTML = "<p>Мастер не найден</p>";
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
        <p><strong>Статус:</strong> ${cells[5].textContent}</p>
    `;
}

async function searchMasterById(id) {
    const resultsDiv = document.getElementById("master-search-results");
    const detailsDiv = document.getElementById("master-result-details");
    
    await getEntityById(id, 'masters')
        .then(master => {
            detailsDiv.innerHTML = `
                <p><strong>Фамилия И. О.:</strong> ${
                    master.last_name + " " + 
                    master.first_name[0] + "." + " " + 
                    master.patronymic[0] + "."
                }</p>
                <p><strong>Телефон:</strong> ${master.phone_number || "—"}</p>
                <p><strong>Статус:</strong> ${getActiveStatus(master.is_active)}</p>
            `;
            resultsDiv.style.display = 'block';
        })
        .catch(error => {
            resultsDiv.style.display = 'block';
        });
}

document.addEventListener("click", async (e) => {
    if (!e.target.closest("#edit-master-btn")) return;
    if (!selectedMasterId) return;

    try {
        const master = await getEntityById(selectedMasterId, 'masters');

        document.getElementById("edit-master-id").value = master.master_id;
        document.getElementById("edit-master-firstname").value = master.first_name ?? "";
        document.getElementById("edit-master-lastname").value = master.last_name ?? "";
        document.getElementById("edit-master-patronymic").value = master.patronymic ?? "";
        document.getElementById("edit-master-phone-number").value = master.phone_number ?? "";
        document.getElementById("edit-master-active").value = master.is_active ?? "";
    } catch (error) {
        throw new Error("Не удалось загрузить мастера");
    }
});

document.getElementById("edit-master-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-master-id").value;
    const errorsDiv = document.getElementById("edit-master-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        master: {
            first_name: document.getElementById("edit-master-firstname").value,
            last_name: document.getElementById("edit-master-lastname").value,
            patronymic: document.getElementById("edit-master-patronymic").value,
            phone_number: document.getElementById("edit-master-phone-number").value,
            is_active: document.getElementById("edit-master-active").value
        }
    };

    try {
        await updateEntity(id, payload, 'masters');
        closeModal(document.getElementById("edit-master-modal"));
        await loadMasters();
        clearMasterSelection();
    } catch (error) {
        if (error.response.message) {
            const list = `<li>${error.response.message}</li>`;
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось изменить мастера</p>`;
        }
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#search-master-form")) return;
    
    e.preventDefault();
    
    const masterId = document.getElementById("search-master-id").value.trim();
    await searchMasterById(masterId);
});

document.getElementById("confirm-delete-master")?.addEventListener("click", async () => {
    if (!selectedMasterId) return;

    try {
        await deleteEntity(selectedMasterId, 'masters');
        closeModal(document.getElementById("delete-master-modal"));
        await loadMasters();
        clearMasterSelection();
    } catch (error) {
        throw new Error("Не удалось удалить мастера");
    }
});

document.addEventListener("click", (e) => {
    const row = e.target.closest(".master-row");

    if (!row) return;

    if (row.classList.contains("active")) {
        clearMasterSelection();
    } else {
        selectMasterRow(row);
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#master-form")) return;

    e.preventDefault();

    const errorsDiv = document.getElementById("master-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        master: {
            first_name: document.getElementById("master-firstname").value,
            last_name: document.getElementById("master-lastname").value,
            patronymic: document.getElementById("master-patronymic").value,
            phone_number: document.getElementById("master-phone-number").value,
            is_active: document.getElementById("master-active").value
        }
    };

    try {
        await createEntity(payload, 'masters');
        closeModal(document.getElementById("master-modal"));
        await loadMasters();
        e.target.reset();

    } catch (error) {
        if (error.response.message) {
            const list = `<li>${error.response.message}</li>`;
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось создать мастера</p>`;
        }
    }
});

window.loadMasters = loadMasters;