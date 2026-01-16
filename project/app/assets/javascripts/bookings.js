let clientsList = [];
let mastersList = [];
let servicesList = [];
let selectedBookingId = null;

async function loadBookings() {
    try {
        const bookings = await getBookings();
        const tbody = document.getElementById("bookings-table-body");
        if (!tbody) {
            console.error("bookings-table-body не найден");
            return;
        }

        tbody.innerHTML = "";

        if (!bookings.length) {
            tbody.innerHTML = `
                <tr>
                <td colspan="8" style="text-align:center;">Записей нет</td>
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
                        ${booking.service.duration + " сек." ?? " "}<br>
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

async function populateClientSelect() {
    const select = document.getElementById('booking-client');
    if (!select) return;
    const currentValue = select.value;
    if (!clientsList.length) {
        clientsList = await getClients();
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

async function populateMasterSelect() {
    const select = document.getElementById('booking-master');
    if (!select) return;
    const currentValue = select.value;
    if (!mastersList.length) {
        mastersList = await getMasters();
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

async function populateServiceSelect() {
    const select = document.getElementById('booking-service');
    if (!select) return;
    const currentValue = select.value;
    if (!servicesList.length) {
        servicesList = await getServices();
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
    
    await getBookingById(id)
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
                    booking.service.duration + " сек. " + 
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

document.addEventListener("submit", async (e) => {
    if (!e.target.matches("#search-booking-form")) return;
    
    e.preventDefault();
    
    const bookingId = document.getElementById("search-booking-id").value.trim();
    await searchBookingById(bookingId);
});

document.getElementById("confirm-delete-booking")?.addEventListener("click", async () => {
    if (!selectedBookingId) return;

    try {
        await deleteBooking(selectedBookingId);
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
        await createBooking(payload);
        closeModal(document.getElementById("booking-modal"));
        await loadBookings();
        e.target.reset();

    } catch (error) {
        console.error(error);
        throw new Error("Не удалось создать запись");
    }
});

window.loadBookings = loadBookings;