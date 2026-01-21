function initReportsTabs() {
    const tabs = document.querySelectorAll('.report-tab');
    const contents = document.querySelectorAll('.report-content');
    const periodSelect = document.getElementById('report-period');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const content = document.getElementById(`${tab.dataset.report}-report`);
            if (content) {
                content.classList.add('active');
                loadReport(tab.dataset.report);
            }
        });
    });

    if (periodSelect) {
        periodSelect.addEventListener('change', () => {
            const activeTab = document.querySelector('.report-tab.active');
            if (activeTab) {
                loadReport(activeTab.dataset.report);
            }
        });
    }

    const activeTab = document.querySelector('.report-tab.active');
    if (activeTab) {
        loadReport(activeTab.dataset.report);
    }
}

function loadReport(type) {
    const periodSelect = document.getElementById('report-period');
    const period = periodSelect ? periodSelect.value : 'month';
    
    switch (type) {
        case 'revenue':
            loadRevenueReport();
            break;
        case 'masters':
            loadMastersReport(period);
            break;
        case 'clients':
            loadClientsReport();
            break;
    }
}

async function loadMastersReport(period = 'month') {
    const body = document.getElementById('masters-report-body');
    const { startDate, endDate } = getDateRange(period);
    const data = await getReport('masters', {
        start_date: startDate,
        end_date: endDate
    });
    document.getElementById("report-period").classList.remove("hidden");
    
    body.innerHTML = '';

    if (!data) {
        body.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;"><strong>Данных для отчета по мастерам нет</strong></td>
            </tr>
        `;
        return;
    }

    data.forEach(row => {
        body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="text-align: center">${row.master_name || 'Не указан'}</td>
                <td style="text-align: center">${row.category || 'Не указана'}</td>
                <td style="text-align: center">${row.service_name || 'Не указана'}</td>
                <td style="text-align: center">${row.unique_clients || 0}</td>
                <td style="text-align: center">${row.total_bookings || 0}</td>
                <td style="text-align: center">${"₽" + row.total_revenue || 0}</td>
                <td style="text-align: center">${"₽" + row.average_price || 0}</td>
            </tr>
        `);
    });
}

async function loadClientsReport() {
    const data = await getReport('clients');
    const body = document.getElementById('clients-report-body');
    document.getElementById("report-period").classList.add("hidden");
    
    body.innerHTML = '';
    
    if (!data) {
        body.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;"><strong>Данных для отчета по клиентам нет</strong></td>
            </tr>
        `;
        return;
    }
    
    data.forEach(row => {
        body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="text-align: center">${row.client_name || 'Не указан'}</td>
                <td style="text-align: center">${row.phone || 'Не указан'}</td>
                <td style="text-align: center">${row.total_visits || 0}</td>
                <td style="text-align: center">${"₽" + row.total_spent || 0}</td>
                <td style="text-align: center">${"₽" + row.average_check || 0}</td>
                <td style="text-align: center">${row.favorite_master || '-'}</td>
                <td style="text-align: center">${row.favorite_category || '-'}</td>
            </tr>
        `);
    });
}

async function loadRevenueReport() {
    const body = document.getElementById('revenue-report-body');
    const data = await getReport('revenue');
    document.getElementById("report-period").classList.add("hidden");

    body.innerHTML = '';

    if (!data) {
        body.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;"><strong>Данных для отчета по выручке нет</strong></td>
            </tr>
        `;
        return;
    }

    data.forEach(row => {
        body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="text-align:center">${formatDate(row.date)}</td>
                <td style="text-align:center">${row.avg_duration}</td>
                <td style="text-align:center">${row.avg_price}</td>
                <td style="text-align:center">${row.master_name}</td>
                <td style="text-align:center">${row.bookings}</td>
                <td style="text-align:center">${'₽' + row.revenue}</td>
                <td style="text-align:center">${row.unique_clients}</td>
            </tr>
        `);
    });
}


function getDateRange(period) {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
        case 'today':
            startDate = today;
            endDate = today;
            break;
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = today;
            break;
        case 'month':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            endDate = today;
            break;
        case 'quarter':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 3);
            endDate = today;
            break;
        case 'year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            endDate = today;
            break;
        default:
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            endDate = today;
    }

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
};
