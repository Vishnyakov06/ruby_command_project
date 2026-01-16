let selectedServiceId = null;

async function loadServices() {
    try {
        const services = await getServices();
        const tbody = document.getElementById("services-table-body");

        if (!tbody) {
            console.error("services-table-body не найден");
            return;
        }

        tbody.innerHTML = "";

        if (!services.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">Услуг нет</td>
            </tr>
        `;
        return;
        }

        services.forEach(service => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr class="service-row" data-id="${service.service_id}">
                    <td style="text-align: center">${service.service_id}</td>
                    <td style="text-align: center">${service.title ?? " "}</td>
                    <td style="text-align: center">${service.duration + " сек." ?? " "}</td>
                    <td style="text-align: center">${"₽" + service.base_price ?? " "}</td>
                    <td style="text-align: center">${service.category ?? " "}</td>
                </tr>
            `);
        });

    } catch (error) {
        console.error("Ошибка загрузки услуг:", error);
    }
}

function selectServiceRow(row) {
    clearServiceSelection();
    row.classList.add("active");
    selectedServiceId = row.dataset.id;
    document.getElementById("edit-service-btn").classList.remove("hidden");
    document.getElementById("delete-service-btn").classList.remove("hidden");
}

function clearServiceSelection() {
    document.querySelectorAll(".service-row.active").forEach(r => r.classList.remove("active"));
    selectedServiceId = null;
    document.getElementById("edit-service-btn")?.classList.add("hidden");
    document.getElementById("delete-service-btn")?.classList.add("hidden");
}

function populateServiceDelete() {
    const detailsContainer = document.getElementById("delete-service-details");
    if (!detailsContainer) return;

    if (!selectedServiceId) {
        detailsContainer.innerHTML = "<p>Услуга не выбрана</p>";
        return;
    }

    const row = document.querySelector(`.service-row[data-id="${selectedServiceId}"]`);
    if (!row) {
        detailsContainer.innerHTML = "<p>Услуга не найдена</p>";
        return;
    }

    const cells = row.children;
    detailsContainer.innerHTML = `
        <p><strong>Название:</strong> ${cells[1].textContent}</p>
        <p><strong>Продолжительность:</strong> ${cells[2].textContent}</p>
        <p><strong>Базовая стоимость:</strong> ${cells[3].textContent}</p>
        <p><strong>Категория:</strong> ${cells[4].textContent}</p>
    `;
}

document.getElementById("confirm-delete-service")?.addEventListener("click", async () => {
    if (!selectedServiceId) return;

    try {
        await deleteService(selectedServiceId);
        closeModal(document.getElementById("delete-service-modal"));
        await loadServices();
        clearServiceSelection();
    } catch (error) {
        throw new Error("Не удалось удалить услугу");
    }
});

document.addEventListener("click", (e) => {
    const row = e.target.closest(".service-row");

    if (!row) return;

    if (row.classList.contains("active")) {
        clearServiceSelection();
    } else {
        selectServiceRow(row);
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#service-form")) return;

    e.preventDefault();

    const payload = {
        service: {
            title: document.getElementById("service-title").value,
            duration: parseInt(document.getElementById("service-duration").value),
            base_price: parseInt(document.getElementById("service-base-price").value),
            category: document.getElementById("service-category").value
        }
    };

    try {
        await createService(payload);
        closeModal(document.getElementById("service-modal"));
        await loadServices();
        e.target.reset();

    } catch (error) {
        console.error(error);
        throw new Error("Не удалось создать услугу");
    }
});

window.loadServices = loadServices;