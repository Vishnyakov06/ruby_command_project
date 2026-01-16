let selectedMasterId = null;

async function loadMasters() {
    try {
        const masters = await getMasters();
        const tbody = document.getElementById("masters-table-body");
        if (!tbody) {
            console.error("masters-table-body не найден");
            return;
        }

        tbody.innerHTML = "";

        if (!masters.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">Мастеров нет</td>
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

document.getElementById("confirm-delete-master")?.addEventListener("click", async () => {
    if (!selectedMasterId) return;

    try {
        await deleteMaster(selectedMasterId);
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
        await createMaster(payload);
        closeModal(document.getElementById("master-modal"));
        await loadMasters();
        e.target.reset();

    } catch (error) {
        console.error(error);
        throw new Error("Не удалось создать мастер");
    }
});

window.loadMasters = loadMasters;