async function loadDashboard() {
    const masters = await getEntity('masters');
    const clients = await getEntity('clients');
    const services = await getEntity('services');
    const bookings = await getEntity('bookings');
    
    document.getElementById('masters-count').textContent = masters.length;
    document.getElementById('clients-count').textContent = clients.length;
    document.getElementById('services-count').textContent = services.length;
    document.getElementById('bookings-count').textContent = bookings.length;
}