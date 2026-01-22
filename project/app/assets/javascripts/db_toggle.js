// database_toggle.js - Управление переключением режима БД
let currentDbMode = 'postgres';

function initDbToggle() {
    const toggleSwitch = document.getElementById('db-toggle-switch');
    const selectBackupBtn = document.getElementById('select-backup-btn');
    
    if (!toggleSwitch) {
        console.log('Переключатель БД не найден на странице');
        return;
    }
    
    console.log('Инициализация переключателя БД...');
    
    // Устанавливаем кнопку выбора файла ВСЕГДА активной
    if (selectBackupBtn) {
        selectBackupBtn.classList.remove('hidden');
        selectBackupBtn.disabled = false;
        selectBackupBtn.title = 'Выбрать файл бэкапа';
        
        // Обработчик для кнопки выбора файла
        selectBackupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openBackupListModal(e);
        });
    }
    
    // Проверяем текущий режим при загрузке
    checkCurrentDbMode();
    
    // Обработчик изменения переключателя
    toggleSwitch.addEventListener('change', handleDbToggleChange);
    
    console.log('✅ Переключатель БД инициализирован');
}

async function checkCurrentDbMode() {
    try {
        const response = await fetch('/api/database_mode/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            currentDbMode = result.mode || 'postgres';
            
            const toggleSwitch = document.getElementById('db-toggle-switch');
            if (toggleSwitch) {
                toggleSwitch.checked = (currentDbMode === 'backup');
                console.log(`Текущий режим БД: ${currentDbMode}`);
            }
        }
    } catch (error) {
        console.log('Не удалось получить текущий режим БД, используем по умолчанию');
        const toggleSwitch = document.getElementById('db-toggle-switch');
        if (toggleSwitch) {
            toggleSwitch.checked = false;
        }
    }
}

async function handleDbToggleChange(event) {
    const isBackupMode = event.target.checked;
    
    console.log(`Переключаем режим на: ${isBackupMode ? 'backup' : 'postgres'}`);
    
    try {
        const response = await fetch('/api/database_mode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            currentDbMode = result.mode || (isBackupMode ? 'backup' : 'postgres');
            console.log(`✅ Режим БД изменен на: ${currentDbMode}`);
            
            // Показываем соответствующее уведомление
            showNotificationModal(
                'Режим БД изменен',
                `Теперь работаем с данными из ${isBackupMode ? 'JSON бэкапа' : 'PostgreSQL'}`,
                'info'
            );
        } else {
            // Если ошибка, возвращаем переключатель в исходное состояние
            event.target.checked = !isBackupMode;
            
            showNotificationModal(
                'Ошибка',
                'Не удалось изменить режим базы данных',
                'error'
            );
        }
    } catch (error) {
        console.error('Ошибка при изменении режима БД:', error);
        
        // Возвращаем переключатель в исходное состояние при ошибке
        event.target.checked = !isBackupMode;
        
        showNotificationModal(
            'Ошибка соединения',
            'Не удалось подключиться к серверу',
            'error'
        );
    }
}

// Функция для выбора файла бэкапа
async function selectBackupForDbMode(filename) {
    if (!filename) {
        showNotificationModal('Ошибка', 'Выберите файл бэкапа', 'error');
        return;
    }
    
    const cleanFilename = filename.replace('.json', '');
    console.log(`Выбран файл бэкапа: ${cleanFilename}`);
    
    try {
        const response = await fetch('/api/database_mode/set_file_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                backup_file: cleanFilename
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Закрываем модальное окно
            const modal = document.getElementById('backup-list-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            
            showNotificationModal(
                'Успех!',
                result.message || `Выбран файл бэкапа: ${filename}`,
                'success'
            );
            
            // Если мы в режиме backup, показываем дополнительное сообщение
            if (currentDbMode === 'backup') {
                setTimeout(() => {
                    showNotificationModal(
                        'Режим обновлен',
                        `Теперь работаем с данными из файла: ${filename}`,
                        'info'
                    );
                }, 1500);
            }
            
        } else {
            showNotificationModal(
                'Ошибка',
                'Не удалось выбрать файл бэкапа',
                'error'
            );
        }
    } catch (error) {
        console.error('Ошибка при выборе файла:', error);
        showNotificationModal(
            'Ошибка соединения',
            'Не удалось подключиться к серверу',
            'error'
        );
    }
}

// Обновляем функцию initTab в index.js
function initTab(tabName) {
    switch (tabName) {
        case "clients":
            if (typeof loadClients === 'function') loadClients();
            break;
        case "masters":
            if (typeof loadMasters === 'function') loadMasters();
            break;
        case "bookings":
            if (typeof loadBookings === 'function') loadBookings();
            break;
        case "services":
            if (typeof loadServices === 'function') loadServices();
            break;
        case "reports":
            if (typeof initReportsTabs === 'function') initReportsTabs();
            break;
        case "dashboard":
            if (typeof loadDashboard === 'function') loadDashboard();
            break;
        case "backup":
            if (typeof initBackup === 'function') initBackup();
            // Инициализируем переключатель БД
            if (typeof initDbToggle === 'function') {
                setTimeout(initDbToggle, 100);
            }
            break;
    }
}