let selectedServiceId = null;

async function loadServices() {
    try {
        const services = await getEntity('services');
        const tbody = document.getElementById("services-table-body");

        if (!tbody) {
            return;
        }

        tbody.innerHTML = "";

        if (!services.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;"><strong>Услуг нет<strong></td>
            </tr>
        `;
        return;
        }

        services.forEach(service => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr class="service-row" data-id="${service.service_id}">
                    <td style="text-align: center">${service.service_id}</td>
                    <td style="text-align: center">${service.title ?? " "}</td>
                    <td style="text-align: center">${service.duration + " мин." ?? " "}</td>
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

async function searchServiceById(id) {
    const resultsDiv = document.getElementById("service-search-results");
    const detailsDiv = document.getElementById("service-result-details");
    
    await getEntityById(id, 'services')
        .then(service => {
            detailsDiv.innerHTML = `
                <p><strong>Название:</strong> ${service.title}</p>
                <p><strong>Продолжительность:</strong> ${service.duration + " мин."}</p>
                <p><strong>Базовая стоимость:</strong> ${service.base_price + "₽"}</p>
                <p><strong>Категория:</strong> ${service.category}</p>
            `;
            resultsDiv.style.display = 'block';
        })
        .catch(error => {
            resultsDiv.style.display = 'block';
        });
}

document.addEventListener("click", async (e) => {
    if (!e.target.closest("#edit-service-btn")) return;
    if (!selectedServiceId) return;

    try {
        const service = await getEntityById(selectedServiceId, 'services');

        document.getElementById("edit-service-id").value = service.service_id;
        document.getElementById("edit-service-title").value = service.title ?? "";
        document.getElementById("edit-service-duration").value = service.duration ?? "";
        document.getElementById("edit-service-base-price").value = service.base_price ?? "";
        document.getElementById("edit-service-category").value = service.category ?? "";
    } catch (error) {
        throw new Error("Не удалось загрузить мастера");
    }
});

document.getElementById("edit-service-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-service-id").value;
    const errorsDiv = document.getElementById("edit-service-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        service: {
            title: document.getElementById("edit-service-title").value,
            duration: parseInt(document.getElementById("edit-service-duration").value),
            base_price: parseInt(document.getElementById("edit-service-base-price").value),
            category: document.getElementById("edit-service-category").value
        }
    };

    try {
        await updateEntity(id, payload, 'services');
        closeModal(document.getElementById("edit-service-modal"));
        await loadServices();
        clearServiceSelection();
    } catch (error) {
        if (error.response.message) {
            const list = `<li>${error.response.message}</li>`;
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось изменить услугу</p>`;
        }
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#search-service-form")) return;
    
    e.preventDefault();
    
    const serviceId = document.getElementById("search-service-id").value.trim();
    await searchServiceById(serviceId);
});

document.getElementById("confirm-delete-service")?.addEventListener("click", async () => {
    if (!selectedServiceId) return;

    try {
        await deleteEntity(selectedServiceId, 'services');
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

    const errorsDiv = document.getElementById("service-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        service: {
            title: document.getElementById("service-title").value,
            duration: parseInt(document.getElementById("service-duration").value),
            base_price: parseInt(document.getElementById("service-base-price").value),
            category: document.getElementById("service-category").value
        }
    };

    try {
        await createEntity(payload, 'services');
        closeModal(document.getElementById("service-modal"));
        await loadServices();
        e.target.reset();

    } catch (error) {
        if (error.response.message) {
            const list = `<li>${error.response.message}</li>`;
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось создать услугу</p>`;
        }
    }
});

window.loadServices = loadServices;