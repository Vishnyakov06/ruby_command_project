// Основной JavaScript файл для фронтенда салона красоты

class BeautySalonApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.masters = [];
        this.clients = [];
        this.appointments = [];
        this.history = [];
        this.selectedMaster = null;
        this.selectedClient = null;
        this.selectedAppointment = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDashboard();
        this.showTab('dashboard');
    }
    
    bindEvents() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.showTab(tab);
            });
        });
        
        // Кнопки добавления
        document.getElementById('add-master-btn').addEventListener('click', () => this.showMasterModal());
        document.getElementById('add-client-btn').addEventListener('click', () => this.showClientModal());
        document.getElementById('add-appointment-btn').addEventListener('click', () => this.showAppointmentModal());
        
        // Фильтрация записей
        document.getElementById('filter-appointments').addEventListener('click', () => this.filterAppointments());
        
        // Модальные окна
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });
        
        document.getElementById('cancel-master').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-client').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-appointment').addEventListener('click', () => this.closeAllModals());
        
        // Формы
        document.getElementById('master-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMaster();
        });
        
        document.getElementById('client-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClient();
        });
        
        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAppointment();
        });
        
        // Бэкап
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('backup-file').addEventListener('change', (e) => {
            document.getElementById('import-btn').disabled = !e.target.files.length;
        });
        document.getElementById('import-btn').addEventListener('click', () => this.importData());
        document.getElementById('undo-btn').addEventListener('click', () => this.undoLastAction());
        
        // Ctrl+Z для отмены действий
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                this.undoLastAction();
            }
        });
        
        // Отчеты
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.showReport(e.currentTarget.dataset.report);
            });
        });
        
        document.getElementById('generate-report').addEventListener('click', () => this.generateReport());
    }
    
    showTab(tabName) {
        // Обновить активную вкладку в навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });
        
        // Показать соответствующий контент
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
        
        this.currentTab = tabName;
        
        // Загрузить данные для вкладки
        switch(tabName) {
            case 'masters':
                this.loadMastersTable();
                break;
            case 'clients':
                this.loadClientsTable();
                break;
            case 'appointments':
                this.loadAppointmentsTable();
                break;
            case 'reports':
                this.initReports();
                break;
            case 'backup':
                this.loadHistory();
                break;
        }
    }
    
    showMasterModal(master = null) {
        const modal = document.getElementById('master-modal');
        const title = modal.querySelector('h3'); // Изменил селектор
        const form = document.getElementById('master-form');
        
        if (master) {
            // Разбиваем ФИО на части
            const nameParts = master.name.split(' ');
            const firstname = nameParts[1] || '';
            const lastname = nameParts[0] || '';
            const middlename = nameParts[2] || '';
            
            title.textContent = 'Редактировать мастера';
            document.getElementById('master-id').value = master.id;
            document.getElementById('master-firstname').value = firstname;
            document.getElementById('master-lastname').value = lastname;
            document.getElementById('master-middlename').value = middlename;
            document.getElementById('master-phone').value = master.phone || '';
            document.getElementById('master-status').value = master.status || 'active';
            document.getElementById('master-active').value = master.active ? 'yes' : 'no';
            this.selectedMaster = master;
        } else {
            title.textContent = 'Добавить мастера';
            if (form) form.reset();
            document.getElementById('master-id').value = '';
            this.selectedMaster = null;
        }
        
        modal.style.display = 'flex';
    }
    
    showClientModal(client = null) {
        const modal = document.getElementById('client-modal');
        const title = modal.querySelector('h3'); // Изменил селектор
        const form = document.getElementById('client-form');
        
        if (client) {
            // Разбиваем ФИО на части
            const nameParts = client.name.split(' ');
            const firstname = nameParts[1] || '';
            const lastname = nameParts[0] || '';
            const middlename = nameParts[2] || '';
            
            title.textContent = 'Редактировать клиента';
            document.getElementById('client-id').value = client.id;
            document.getElementById('client-firstname').value = firstname;
            document.getElementById('client-lastname').value = lastname;
            document.getElementById('client-middlename').value = middlename;
            document.getElementById('client-phone').value = client.phone || '';
            document.getElementById('client-reg-date').value = client.regDate || this.getTodayDate();
            this.selectedClient = client;
        } else {
            title.textContent = 'Добавить клиента';
            if (form) form.reset();
            document.getElementById('client-id').value = '';
            // Устанавливаем сегодняшнюю дату по умолчанию
            const regDateField = document.getElementById('client-reg-date');
            if (regDateField) regDateField.value = this.getTodayDate();
            this.selectedClient = null;
        }
        
        modal.style.display = 'flex';
    }
    
    showAppointmentModal(appointment = null) {
        const modal = document.getElementById('appointment-modal');
        const title = modal.querySelector('h3'); // Изменил селектор
        const form = document.getElementById('appointment-form');
        
        // Заполнить выпадающие списки
        this.populateClientDropdown();
        this.populateMasterDropdown();
        
        if (appointment) {
            title.textContent = 'Редактировать запись';
            document.getElementById('appointment-id').value = appointment.id;
            document.getElementById('appointment-client').value = appointment.clientId || '';
            document.getElementById('appointment-master').value = appointment.masterId || '';
            document.getElementById('appointment-service').value = appointment.service || '';
            document.getElementById('appointment-price').value = appointment.price || '';
            document.getElementById('appointment-time').value = appointment.time || '10:00';
            document.getElementById('appointment-note').value = appointment.note || '';
            this.selectedAppointment = appointment;
        } else {
            title.textContent = 'Новая запись';
            if (form) form.reset();
            document.getElementById('appointment-id').value = '';
            // Устанавливаем время по умолчанию
            const timeField = document.getElementById('appointment-time');
            if (timeField) timeField.value = '10:00';
            this.selectedAppointment = null;
        }
        
        modal.style.display = 'flex';
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    saveMaster() {
        const masterData = {
            id: document.getElementById('master-id').value || Date.now().toString(),
            firstname: document.getElementById('master-firstname').value,
            lastname: document.getElementById('master-lastname').value,
            middlename: document.getElementById('master-middlename').value || '',
            phone: document.getElementById('master-phone').value,
            status: document.getElementById('master-status').value,
            active: document.getElementById('master-active').value === '1'
        };
        
        // Формируем полное имя для отображения
        masterData.name = `${masterData.lastname} ${masterData.firstname} ${masterData.middlename}`.trim();
        
        // Валидация
        if (!this.validateMaster(masterData)) return;
        
        if (this.selectedMaster) {
            // Обновление
            const index = this.masters.findIndex(m => m.id === this.selectedMaster.id);
            if (index !== -1) {
                this.addToHistory('update', 'master', this.masters[index], masterData);
                this.masters[index] = masterData;
            }
        } else {
            // Добавление
            this.addToHistory('create', 'master', null, masterData);
            this.masters.push(masterData);
        }
        
        this.loadMastersTable();
        this.updateDashboard();
        this.closeAllModals();
        this.showNotification('Мастер сохранен успешно!', 'success');
    }
    
    saveClient() {
        const clientData = {
            id: document.getElementById('client-id').value || Date.now().toString(),
            firstname: document.getElementById('client-firstname').value,
            lastname: document.getElementById('client-lastname').value,
            middlename: document.getElementById('client-middlename').value || '',
            phone: document.getElementById('client-phone').value,
            regDate: document.getElementById('client-reg-date').value
        };
        
        // Формируем полное имя
        clientData.name = `${clientData.lastname} ${clientData.firstname} ${clientData.middlename}`.trim();
        
        // Валидация
        if (!this.validateClient(clientData)) return;
        
        if (this.selectedClient) {
            // Обновление
            const index = this.clients.findIndex(c => c.id === this.selectedClient.id);
            if (index !== -1) {
                this.addToHistory('update', 'client', this.clients[index], clientData);
                this.clients[index] = clientData;
            }
        } else {
            // Добавление
            this.addToHistory('create', 'client', null, clientData);
            this.clients.push(clientData);
        }
        
        this.loadClientsTable();
        this.updateDashboard();
        this.closeAllModals();
        this.showNotification('Клиент сохранен успешно!', 'success');
    }
    
    saveAppointment() {
        const appointmentData = {
            id: document.getElementById('appointment-id').value || Date.now().toString(),
            clientId: document.getElementById('appointment-client').value,
            masterId: document.getElementById('appointment-master').value,
            service: document.getElementById('appointment-service').value,
            price: parseInt(document.getElementById('appointment-price').value),
            time: document.getElementById('appointment-time').value,
            note: document.getElementById('appointment-note').value || '',
            createDate: new Date().toISOString().split('T')[0]
        };
        
        // Получаем имена для отображения
        const client = this.clients.find(c => c.id === appointmentData.clientId);
        const master = this.masters.find(m => m.id === appointmentData.masterId);
        
        appointmentData.clientName = client ? client.name : 'Неизвестный клиент';
        appointmentData.masterName = master ? master.name : 'Неизвестный мастер';
        
        // Содержательная валидация
        const validationErrors = this.validateAppointment(appointmentData);
        if (validationErrors.length > 0) {
            this.showNotification(validationErrors.join('<br>'), 'error');
            return;
        }
        
        if (this.selectedAppointment) {
            // Обновление
            const index = this.appointments.findIndex(a => a.id === this.selectedAppointment.id);
            if (index !== -1) {
                this.addToHistory('update', 'appointment', this.appointments[index], appointmentData);
                this.appointments[index] = appointmentData;
            }
        } else {
            // Добавление
            this.addToHistory('create', 'appointment', null, appointmentData);
            this.appointments.push(appointmentData);
            
            // Увеличиваем счетчик посещений клиента
            const clientIndex = this.clients.findIndex(c => c.id === appointmentData.clientId);
            if (clientIndex !== -1) {
                this.clients[clientIndex].visits = (this.clients[clientIndex].visits || 0) + 1;
            }
        }
        
        this.loadAppointmentsTable();
        this.updateDashboard();
        this.closeAllModals();
        this.showNotification('Запись сохранена успешно!', 'success');
    }
    
    loadMastersTable() {
        const tbody = document.getElementById('masters-table-body');
        tbody.innerHTML = '';
        
        this.masters.forEach(master => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${master.id.slice(-4)}</td>
                <td>${master.name}</td>
                <td>${master.specialty}</td>
                <td>${master.phone}</td>
                <td>${master.rate} ₽</td>
                <td><span class="status-badge status-${master.status}">${this.getStatusText(master.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="app.editMaster('${master.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="app.deleteMaster('${master.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon btn-view" onclick="app.showMasterAppointments('${master.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    loadClientsTable() {
        const tbody = document.getElementById('clients-table-body');
        tbody.innerHTML = '';
        
        this.clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${client.id.slice(-4)}</td>
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.email || '-'}</td>
                <td>${client.birthdate ? this.formatDate(client.birthdate) : '-'}</td>
                <td>${client.discount}%</td>
                <td>${client.visits || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="app.editClient('${client.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="app.deleteClient('${client.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon btn-view" onclick="app.showClientAppointments('${client.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    loadAppointmentsTable() {
        const tbody = document.getElementById('appointments-table-body');
        tbody.innerHTML = '';
        
        // Фильтр по дате
        const dateFilter = document.getElementById('appointment-date-filter').value;
        let filteredAppointments = this.appointments;
        
        if (dateFilter) {
            filteredAppointments = this.appointments.filter(app => app.date === dateFilter);
        }
        
        // Сортировка по дате и времени
        filteredAppointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
        
        filteredAppointments.forEach(appointment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${appointment.id.slice(-4)}</td>
                <td>${appointment.clientName}</td>
                <td>${appointment.masterName}</td>
                <td>${appointment.service}</td>
                <td>${this.formatDate(appointment.date)} ${appointment.time}</td>
                <td>${appointment.duration} мин</td>
                <td>${appointment.price} ₽</td>
                <td><span class="status-badge status-${appointment.status}">${this.getStatusText(appointment.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="app.editAppointment('${appointment.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="app.deleteAppointment('${appointment.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon btn-view" onclick="app.completeAppointment('${appointment.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    initReports() {
        this.showReport('revenue');
    }
    
    showReport(reportName) {
        // Обновить активную вкладку отчетов
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.report === reportName);
        });
        
        // Показать соответствующий контент
        document.querySelectorAll('.report-content').forEach(content => {
            content.classList.toggle('active', content.id === `${reportName}-report`);
        });
    }
    
    generateReport() {
        const period = document.getElementById('report-period').value;
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Пример данных для графика
        const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const data = labels.map(() => Math.floor(Math.random() * 50000) + 10000);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Выручка (₽)',
                    data: data,
                    borderColor: '#6a11cb',
                    backgroundColor: 'rgba(106, 17, 203, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Выручка за ${this.getPeriodText(period)}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('ru-RU') + ' ₽';
                            }
                        }
                    }
                }
            }
        });
    }
    
    exportData() {
        const format = document.querySelector('input[name="format"]:checked').value;
        const data = {
            masters: this.masters,
            clients: this.clients,
            appointments: this.appointments,
            exportDate: new Date().toISOString()
        };
        
        let content, filename, mimeType;
        
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = `beauty-salon-backup-${this.getTodayDate()}.json`;
            mimeType = 'application/json';
        } else {
            // Для YAML нужно было бы подключить библиотеку, используем JSON
            content = JSON.stringify(data, null, 2);
            filename = `beauty-salon-backup-${this.getTodayDate()}.yaml`;
            mimeType = 'application/yaml';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Данные экспортированы в ${format.toUpperCase()}`, 'success');
    }
    
    importData() {
        const fileInput = document.getElementById('backup-file');
        if (!fileInput.files.length) return;
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.masters && data.clients && data.appointments) {
                    this.confirmAction('Импорт данных', 'Вы уверены, что хотите импортировать данные? Текущие данные будут заменены.', () => {
                        this.addToHistory('import', 'all', {
                            masters: this.masters,
                            clients: this.clients,
                            appointments: this.appointments
                        }, data);
                        
                        this.masters = data.masters;
                        this.clients = data.clients;
                        this.appointments = data.appointments;
                        
                        this.loadMastersTable();
                        this.loadClientsTable();
                        this.loadAppointmentsTable();
                        this.updateDashboard();
                        this.loadHistory();
                        
                        fileInput.value = '';
                        document.getElementById('import-btn').disabled = true;
                        
                        this.showNotification('Данные успешно импортированы!', 'success');
                    });
                } else {
                    this.showNotification('Файл имеет неверный формат', 'error');
                }
            } catch (error) {
                this.showNotification('Ошибка при чтении файла', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.innerHTML = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Вспомогательные методы
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
    
    getStatusText(status) {
        const statusMap = {
            'active': 'Активен',
            'inactive': 'Неактивен',
            'vacation': 'В отпуске',
            'pending': 'Ожидает',
            'completed': 'Выполнена',
            'cancelled': 'Отменена'
        };
        return statusMap[status] || status;
    }
    
    getPeriodText(period) {
        const periodMap = {
            'today': 'сегодня',
            'week': 'неделю',
            'month': 'месяц',
            'quarter': 'квартал',
            'year': 'год'
        };
        return periodMap[period] || period;
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BeautySalonApp();
});