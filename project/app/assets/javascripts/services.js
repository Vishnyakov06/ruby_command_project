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
        <tr data-id="${service.service_id}">
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

window.loadServices = loadServices;