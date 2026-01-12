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

function getActiveStatus(isActive) {
  return isActive ? "Активен" : "Не активен";
}

window.loadMasters = loadMasters;