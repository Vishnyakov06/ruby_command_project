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
                <tr data-id="${booking.booking_id}" >
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

window.loadBookings = loadBookings;