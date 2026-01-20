async function loadDashboard() {
    const masters = await getEntity('masters');
    const clients = await getEntity('clients');
    const services = await getEntity('services');
    const bookings = await getEntity('bookings');
    
    document.getElementById('masters-count').textContent = masters.length;
    document.getElementById('clients-count').textContent = clients.length;
    document.getElementById('services-count').textContent = services.length;
    document.getElementById('bookings-count').textContent = bookings.length;

    const upcomingAppointmentsEl = document.getElementById('upcoming-appointments');
    upcomingAppointmentsEl.innerHTML = '';

    const upcomingBookings = bookings
        .filter(b => new Date(b.date_service) >= new Date())
        .sort((a, b) => new Date(a.date_service) - new Date(b.date_service))
        .slice(0, 3);

    if (upcomingBookings.length === 0) {
        upcomingAppointmentsEl.innerHTML = '<p>Нет ближайших записей</p>';
    } else {
        upcomingBookings.forEach(b => {
            const date = new Date(b.date_service);
            upcomingAppointmentsEl.insertAdjacentHTML('beforeend', `
                <div class="appointment-card">
                    <p><strong>${b.client.last_name} ${b.client.first_name} ${b.client.patronymic || ''}</strong></p>
                    <p>${formatDate(date)} — ${b.service.title || ''}</p>
                    <p>Мастер: ${b.master.last_name} ${b.master.first_name} ${b.master.patronymic || ''}</p>
                </div>
            `);
        });
    }

    const popularMastersEl = document.getElementById('popular-masters');
    popularMastersEl.innerHTML = '';

    const masterCounts = {};
    bookings.forEach(b => {
        masterCounts[b.master.last_name + " " + b.master.first_name] = (masterCounts[b.master.last_name + " " + b.master.first_name] || 0) + 1;
    });

    const popularMasters = Object.entries(masterCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    if (popularMasters.length === 0) {
        popularMastersEl.innerHTML = '<p>Нет данных</p>';
    } else {
        popularMasters.forEach(([name, count]) => {
            popularMastersEl.insertAdjacentHTML('beforeend', `
                <div class="master-card">
                    <p><strong>${name}</strong></p>
                    <p>Записей: ${count}</p>
                </div>
            `);
        });
    }
}