async function loadClients() {
  try {
    const clients = await getClients();

    const tbody = document.getElementById("clients-table-body");
    if (!tbody) {
      console.error("clients-table-body не найден");
      return;
    }

    tbody.innerHTML = "";

    if (!clients.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">Клиентов нет</td>
        </tr>
      `;
      return;
    }

    clients.forEach(client => {
      tbody.insertAdjacentHTML("beforeend", `
        <tr data-id="${client.client_id}">
          <td style="text-align: center">${client.client_id}</td>
          <td style="text-align: center">${client.last_name ?? " "}</td>
          <td style="text-align: center">${client.first_name ?? " "}</td>
          <td style="text-align: center">${client.patronymic ?? " "}</td>
          <td style="text-align: center">${client.phone_number ?? " "}</td>
          <td style="text-align: center">${formatDate(client.registartion_date)}</td>
        </tr>
      `);
    });

  } catch (error) {
    console.error("Ошибка загрузки клиентов:", error);
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ru-RU");
}

window.loadClients = loadClients;