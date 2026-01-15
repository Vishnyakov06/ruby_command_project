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
            <tr data-id="${master.master_id}">
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

function getActiveStatus(isActive) {
    return isActive ? "Активен" : "Не активен";
}

window.loadMasters = loadMasters;