let clientsList = [];
let mastersList = [];
let servicesList = [];
let selectedBookingId = null;

async function loadBookings() {
    try {
        const bookings = await getEntity('bookings');
        const tbody = document.getElementById("bookings-table-body");
        if (!tbody) {
            console.error("bookings-table-body не найден");
            return;
        }

        tbody.innerHTML = "";

        if (!bookings.length) {
            tbody.innerHTML = `
                <tr>
                <td colspan="8" style="text-align:center;"><strong>Записей нет</strong></td>
                </tr>
            `;
            return;
        }

        bookings.forEach(booking => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr class="booking-row" data-id="${booking.booking_id}" >
                    <td>${booking.booking_id}</td>
                    <td style="text-align: center">
                        ${booking.client.last_name ?? " "}<br>
                        ${booking.client.first_name ?? " "}<br>
                        ${booking.client.phone_number ?? " "}
                    </td>
                    <td style="text-align: center">
                        ${booking.master.last_name ?? " "}<br>
                        ${booking.master.first_name ?? " "}<br>
                        ${booking.master.phone_number ?? " "}
                    </td>
                    <td style="text-align: center">
                        ${booking.service.title ?? " "}<br>
                        ${booking.service.duration + " мин." ?? " "}<br>
                        ${"₽" + booking.service.base_price ?? " "}
                    </td>
                    <td style="text-align: center">${formatDate(booking.date_service, true) ?? " "}</td>
                    <td style="text-align: center">${booking.status ?? " "}</td>
                    <td style="text-align: center">${"₽" + booking.price ?? " "}</td>
                    <td style="text-align: center">${booking.notes ?? " "}</td>
                </tr>
            `);
        });

    } catch (error) {
        console.error("Ошибка загрузки записей:", error);
    }
}

function selectBookingRow(row) {
    clearBookingSelection();
    row.classList.add("active");
    selectedBookingId = row.dataset.id;
    document.getElementById("edit-booking-btn").classList.remove("hidden");
    document.getElementById("delete-booking-btn").classList.remove("hidden");
}

function clearBookingSelection() {
    document.querySelectorAll(".booking-row.active").forEach(r => r.classList.remove("active"));
    selectedBookingId = null;
    document.getElementById("edit-booking-btn")?.classList.add("hidden");
    document.getElementById("delete-booking-btn")?.classList.add("hidden");
}

function formatDate(dateString, includeTime = false) {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    if (includeTime) {
        return date.toLocaleDateString("ru-RU", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
        });
    } else {
        return date.toLocaleDateString("ru-RU");
    }
}

async function populateClientSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const currentValue = select.value;
    if (!clientsList.length) {
        clientsList = await getEntity('clients');
    }
    select.innerHTML = '<option value="">Выберите клиента</option>';
    
    clientsList.forEach(client => {
        const option = document.createElement('option');
        option.value = client.client_id;
        option.textContent = `${client.last_name} ${client.first_name} ${client.patronymic || ''}`.trim();
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

async function populateMasterSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const currentValue = select.value;
    if (!mastersList.length) {
        mastersList = await getEntity('masters');
    }
    select.innerHTML = '<option value="">Выберите мастера</option>';

    mastersList.forEach(master => {
        const option = document.createElement('option');
        option.value = master.master_id;
        option.textContent = `${master.last_name} ${master.first_name} ${master.patronymic || ''}`.trim();
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

async function populateServiceSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const currentValue = select.value;
    if (!servicesList.length) {
        servicesList = await getEntity('services');
    }
    select.innerHTML = '<option value="">Выберите услугу</option>';
    
    servicesList.forEach(service => {
        const option = document.createElement('option');
        option.value = service.service_id;
        option.textContent = `${service.title}`.trim();
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

function populateBookingDelete() {
    const detailsContainer = document.getElementById("delete-booking-details");
    if (!detailsContainer) return;

    if (!selectedBookingId) {
        detailsContainer.innerHTML = "<p>Запись не выбрана</p>";
        return;
    }

    const row = document.querySelector(`.booking-row[data-id="${selectedBookingId}"]`);
    if (!row) {
        detailsContainer.innerHTML = "<p>Запись не найдена</p>";
        return;
    }

    const cells = row.children;
    detailsContainer.innerHTML = `
        <p><strong>Клиент:</strong> ${cells[1].textContent}</p>
        <p><strong>Мастер:</strong> ${cells[2].textContent}</p>
        <p><strong>Услуга:</strong> ${cells[3].textContent}</p>
        <p><strong>Дата:</strong> ${cells[4].textContent}</p>
    `;
}

async function searchBookingById(id) {
    const resultsDiv = document.getElementById("booking-search-results");
    const detailsDiv = document.getElementById("booking-result-details");
    
    await getEntityById(id, 'bookings')
        .then(booking => {
            detailsDiv.innerHTML = `
                <p><strong>Клиент:</strong> ${
                    booking.client.last_name + " " + 
                    booking.client.first_name + ", " + 
                    booking.client.phone_number
                }</p>
                <p><strong>Мастер:</strong> ${
                    booking.master.last_name + " " + 
                    booking.master.first_name + ", " + 
                    booking.master.phone_number
                }</p>
                <p><strong>Услуга:</strong> ${
                    booking.service.title + ", " + 
                    booking.service.duration + " мин. " + 
                    booking.service.base_price + "₽"
                }</p>
                <p><strong>Дата:</strong> ${formatDate(booking.date_service)}</p>
                <p><strong>Статус:</strong> ${booking.status}</p>
                <p><strong>Цена:</strong> ${booking.price + "₽"}</p>
                <p><strong>Заметка:</strong> ${booking.notes || "-"}</p>
            `;
            resultsDiv.style.display = 'block';
        })
        .catch(error => {
            resultsDiv.style.display = 'block';
        });
}

function formatForInputDatetime(value) {
    if (!value) return "";
    const d = new Date(value);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

document.addEventListener("click", async (e) => {
    if (!e.target.closest("#edit-booking-btn")) return;
    if (!selectedBookingId) return;

    try {
        const booking = await getEntityById(selectedBookingId, 'bookings');

        document.getElementById("edit-booking-id").value = booking.booking_id;

        await populateClientSelect("edit-booking-client");
        await populateMasterSelect("edit-booking-master");
        await populateServiceSelect("edit-booking-service");

        document.getElementById("edit-booking-client").value = booking.client.client_id;
        document.getElementById("edit-booking-master").value = booking.master.master_id;
        document.getElementById("edit-booking-service").value = booking.service.service_id;
        document.getElementById("edit-booking-time").value = formatForInputDatetime(booking.date_service);
        document.getElementById("edit-booking-price").value = booking.price ?? "";
        document.getElementById("edit-booking-status").value = booking.status ?? "";
        document.getElementById("edit-booking-note").value = booking.notes ?? "";

    } catch (error) {
        console.error("Не удалось загрузить запись", error);
    }
});

document.getElementById("edit-booking-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-booking-id").value;
    const errorsDiv = document.getElementById("edit-booking-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        booking: {
            client_id: document.getElementById("edit-booking-client").value,
            master_id: document.getElementById("edit-booking-master").value,
            service_id: document.getElementById("edit-booking-service").value,
            date_service: document.getElementById("edit-booking-time").value,
            price: document.getElementById("edit-booking-price").value,
            status: document.getElementById("edit-booking-status").value,
            notes: document.getElementById("edit-booking-note").value
        }
    };

    try {
        await updateEntity(id, payload, 'bookings');
        closeModal(document.getElementById("edit-booking-modal"));
        await loadBookings();
        clearBookingSelection();
    } catch (error) {
        if (error.response && error.response.errors) {
            const list = error.response.errors.map(msg => `<li>${msg}</li>`).join("");
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось изменить запись</p>`;
        }
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#search-booking-form")) return;
    
    e.preventDefault();
    
    const bookingId = document.getElementById("search-booking-id").value.trim();
    await searchBookingById(bookingId);
});

document.getElementById("confirm-delete-booking")?.addEventListener("click", async () => {
    if (!selectedBookingId) return;

    try {
        await deleteEntity(selectedBookingId, 'bookings');
        closeModal(document.getElementById("delete-booking-modal"));
        await loadBookings();
        clearBookingSelection();
    } catch (error) {
        throw new Error("Не удалось удалить записи");
    }
});

document.addEventListener("click", (e) => {
    const row = e.target.closest(".booking-row");

    if (!row) return;

    if (row.classList.contains("active")) {
        clearBookingSelection();
    } else {
        selectBookingRow(row);
    }
});

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#booking-form")) return;

    e.preventDefault();

    const errorsDiv = document.getElementById("booking-errors");
    errorsDiv.innerHTML = "";

    const payload = {
        booking: {
            client_id: document.getElementById("booking-client").value,
            master_id: document.getElementById("booking-master").value,
            service_id: document.getElementById("booking-service").value,
            date_service: document.getElementById("booking-time").value,
            price: document.getElementById("booking-price").value,
            status: document.getElementById("booking-status").value,
            notes: document.getElementById("booking-note").value
        }
    };

    try {
        await createEntity(payload, 'bookings');
        closeModal(document.getElementById("booking-modal"));
        await loadBookings();
        e.target.reset();

    } catch (error) {
        if (error.response && error.response.errors) {
            const list = error.response.errors.map(msg => `<li>${msg}</li>`).join("");
            errorsDiv.innerHTML = `<ul>${list}</ul>`;
        } else {
            errorsDiv.innerHTML = `<p>Не удалось создать запись</p>`;
        }
    }
});

window.loadBookings = loadBookings;