let selectedBackupFilename = null;

window.initBackup = function() {
    console.log('✅ initBackup вызван для вкладки backup');
    
    const exportBtn = document.getElementById("export-btn");
    if (exportBtn) {
        exportBtn.addEventListener("click", handleExportClick);
    }
    
    const importBtn = document.getElementById("import-btn");
    if (importBtn) {
        importBtn.addEventListener("click", handleImportClick);
    }
    
    const backupFileInput = document.getElementById("backup-file");
    if (backupFileInput) {
        backupFileInput.addEventListener("change", handleFileSelect);
    }
    
    const chooseFileBtn = document.querySelector('label[for="backup-file"]');
    if (chooseFileBtn) {
        chooseFileBtn.addEventListener("click", openBackupListModal);
    }

    initDatabaseToggle();
    
    console.log('✅ Все обработчики для backup инициализированы');
};


async function handleExportClick(e) {
    e.preventDefault();
    
    const exportBtn = e.target.closest("#export-btn");
    const originalHtml = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
    exportBtn.disabled = true;
    
    try {
        const result = await createBackup();
        
        if (result.success) {
            showNotificationModal(
                'Успех!',
                `Бэкап успешно создан.\nФайл: ${result.backup}`,
                'success'
            );
        } else {
            showNotificationModal(
                'Ошибка',
                result.error || 'Не удалось создать бэкап',
                'error'
            );
        }
    } catch (error) {
        console.error('Ошибка при создании бэкапа:', error);
        showNotificationModal(
            'Ошибка соединения',
            'Не удалось подключиться к серверу',
            'error'
        );
    } finally {
        exportBtn.innerHTML = originalHtml;
        exportBtn.disabled = false;
    }
}


async function handleImportClick(e) {
    e.preventDefault();
    
    if (!confirm('Вы уверены, что хотите восстановить данные из последнего бэкапа? Все текущие данные будут удалены.')) {
        return;
    }
    
    const importBtn = e.target.closest("#import-btn");
    const originalHtml = importBtn.innerHTML;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Восстановление...';
    importBtn.disabled = true;
    
    try {
        const result = await restoreBackup();
        
        if (result.success) {
            showNotificationModal(
                'Успех!',
                result.message,
                'success'
            );
            
        } else {
            showNotificationModal(
                'Ошибка',
                result.error || 'Не удалось восстановить данные',
                'error'
            );
        }
    } catch (error) {
        console.error('Ошибка при восстановлении:', error);
        showNotificationModal(
            'Ошибка соединения',
            'Не удалось подключиться к серверу',
            'error'
        );
    } finally {
        importBtn.innerHTML = originalHtml;
        importBtn.disabled = false;
    }
}

function handleFileSelect(e) {
    const fileInput = e.target;
    const importBtn = document.getElementById("import-btn");
    
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        const fileLabel = document.querySelector('label[for="backup-file"]');
        
        if (fileLabel) {
            fileLabel.innerHTML = `<i class="fas fa-file"></i> ${fileName}`;
        }
        
        importBtn.disabled = false;
    }
}

async function openBackupListModal(e) {
    e.preventDefault();
    
    const modal = document.getElementById('backup-list-modal');
    if (!modal) {
        console.error('Модальное окно списка бэкапов не найдено');
        return;
    }
    
    modal.classList.add('active');
    
    await loadBackupList();
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            selectedBackupFilename = null;
        });
    });
    
    const restoreBtn = document.getElementById('restore-selected-btn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restoreSelectedBackup);
    }
}

async function loadBackupList() {
    const loading = document.getElementById('backup-loading');
    const backupList = document.getElementById('backup-list');
    const noBackups = document.getElementById('no-backups');
    
    try {
        const result = await listBackup();
        
        loading.style.display = 'none';
        
        if (result.success && result.backups.length > 0) {
            backupList.innerHTML = '';
            backupList.style.display = 'block';
            noBackups.style.display = 'none';
            
            result.backups.forEach(backup => {
                const backupItem = document.createElement('div');
                backupItem.className = 'backup-item';
                backupItem.dataset.filename = backup.filename;
                
                backupItem.innerHTML = `
                    <div class="backup-info">
                        <div class="backup-filename">${backup.filename}</div>
                        <div class="backup-details">
                            <span class="backup-size">${backup.formatted_size || formatFileSize(backup.size)}</span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                `;
                
                backupItem.addEventListener('click', () => selectBackupItem(backupItem, backup.filename));
                backupList.appendChild(backupItem);
            });
        } else {
            backupList.style.display = 'none';
            noBackups.style.display = 'block';
            noBackups.innerHTML = `<p>${result.message || 'Нет доступных бэкапов'}</p>`;
        }
    } catch (error) {
        console.error('Ошибка загрузки списка бэкапов:', error);
        loading.style.display = 'none';
        noBackups.style.display = 'block';
        noBackups.innerHTML = '<p>Ошибка загрузки списка бэкапов</p>';
    }
}

function selectBackupItem(item, filename) {
    document.querySelectorAll('.backup-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    item.classList.add('selected');
    selectedBackupFilename = filename;
    
    const restoreBtn = document.getElementById('restore-selected-btn');
    if (restoreBtn) {
        restoreBtn.disabled = false;
    }
}

async function restoreSelectedBackup() {
    if (!selectedBackupFilename) {
        showNotificationModal('Ошибка', 'Выберите бэкап для восстановления', 'error');
        return;
    }
    
    if (!confirm(`Вы уверены, что хотите восстановить данные из бэкапа "${selectedBackupFilename}"? Все текущие данные будут удалены.`)) {
        return;
    }

    selectedBackupFilename = selectedBackupFilename.replace('.json', '');
    console.log("полученное имя: " + selectedBackupFilename);

    const restoreBtn = document.getElementById('restore-selected-btn');
    const originalHtml = restoreBtn.innerHTML;
    restoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Восстановление...';
    restoreBtn.disabled = true;
    
    try {
        const result = await restoreSpecificBackup();
        
        if (result.success) {
            showNotificationModal(
                'Успех!',
                result.message,
                'success'
            );
            
            const modal = document.getElementById('backup-list-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            
            selectedBackupFilename = null;
            
        } else {
            showNotificationModal(
                'Ошибка',
                result.error || 'Не удалось восстановить данные',
                'error'
            );
        }
    } catch (error) {
        console.error('Ошибка при восстановлении:', error);
        showNotificationModal(
            'Ошибка соединения',
            'Не удалось подключиться к серверу',
            'error'
        );
    } finally {
        restoreBtn.innerHTML = originalHtml;
        restoreBtn.disabled = false;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function initDatabaseToggle() {
    const toggleSwitch = document.getElementById('db-toggle-switch');
    const selectBackupBtn = document.getElementById('select-backup-btn');
    
    if (toggleSwitch) {
        // Получаем текущий режим из сайдбара при инициализации
        const backupTabItem = document.querySelector('.nav-item[data-tab="backup"]');
        if (backupTabItem && backupTabItem.dataset.currentMode) {
            const currentMode = backupTabItem.dataset.currentMode;
            toggleSwitch.checked = currentMode === 'backup';
            updateBackupButtonState(currentMode);
        }
        
        toggleSwitch.addEventListener('change', async function() {
            const result = await updateDatabase();
            const newMode = result.mode.toLowerCase().includes('backup') ? 'backup' : 'postgresql';
            
            // Обновляем data-атрибут на переключателе
            toggleSwitch.dataset.currentMode = newMode;
            
            // Обновляем data-атрибут в сайдбаре
            const backupTabItem = document.querySelector('.nav-item[data-tab="backup"]');
            if (backupTabItem) {
                backupTabItem.dataset.currentMode = newMode;
            }
            
            updateBackupButtonState(newMode);
        });

        if (selectBackupBtn) {
            selectBackupBtn.addEventListener('click', openDbFileSelectModal);
        }
    }
}
function updateBackupButtonState(mode) {
    const selectBackupBtn = document.getElementById('select-backup-btn');
    if (selectBackupBtn) {
        if (mode === 'backup') {
            selectBackupBtn.classList.add('active');
            selectBackupBtn.disabled = false;
        } else {
            selectBackupBtn.classList.remove('active');
            selectBackupBtn.disabled = true;
        }
    }
}






async function openDbFileSelectModal(e) {
    e.preventDefault();
    
    const modal = document.getElementById('db-file-select-modal');
    if (!modal) {
        console.error('Модальное окно выбора файла БД не найдено');
        return;
    }
    
    modal.classList.add('active');
    
    await loadDbFileList();
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            selectedBackupFilename = null;
        });
    });
    
    const confirmBtn = document.getElementById('confirm-db-file-btn');
    if (confirmBtn) {
        // Убираем старый обработчик
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        
        // Добавляем новый обработчик
        document.getElementById('confirm-db-file-btn').addEventListener('click', selectDbFile);
    }
}

// Загрузка списка файлов для выбора БД
async function loadDbFileList() {
    const loading = document.getElementById('db-file-loading');
    const backupList = document.getElementById('db-file-list');
    const noBackups = document.getElementById('db-no-backups');
    const confirmBtn = document.getElementById('confirm-db-file-btn');
    
    try {
        const result = await listBackup();
        
        loading.style.display = 'none';
        
        if (result.success && result.backups.length > 0) {
            backupList.innerHTML = '';
            backupList.style.display = 'block';
            noBackups.style.display = 'none';
            
            result.backups.forEach(backup => {
                const backupItem = document.createElement('div');
                backupItem.className = 'backup-item db-file-item';
                backupItem.dataset.filename = backup.filename;
                
                backupItem.innerHTML = `
                    <div class="backup-info">
                        <div class="backup-filename">${backup.filename}</div>
                        <div class="backup-details">
                            <span class="backup-date">${backup.created_at ? formatBackupDate(backup.created_at) : ''}</span>
                            <span class="backup-size">${backup.formatted_size || formatFileSize(backup.size)}</span>
                        </div>
                    </div>
                    <i class="fas fa-check-circle"></i>
                `;
                
                backupItem.addEventListener('click', () => selectDbFileItem(backupItem, backup.filename));
                backupList.appendChild(backupItem);
            });
        } else {
            backupList.style.display = 'none';
            noBackups.style.display = 'block';
            noBackups.innerHTML = `<p>${result.message || 'Нет доступных бэкапов'}</p>`;
        }
    } catch (error) {
        console.error('Ошибка загрузки списка бэкапов:', error);
        loading.style.display = 'none';
        noBackups.style.display = 'block';
        noBackups.innerHTML = '<p>Ошибка загрузки списка бэкапов</p>';
    }
    
    // Отключаем кнопку подтверждения
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
}

// Выбор файла в списке для БД
function selectDbFileItem(item, filename) {
    document.querySelectorAll('.db-file-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    item.classList.add('selected');
    selectedBackupFilename = filename;
    
    const confirmBtn = document.getElementById('confirm-db-file-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<i class="fas fa-check"></i> Использовать "${filename}"`;
    }
}

// Выбор файла для БД
async function selectDbFile() {
    if (!selectedBackupFilename) {
        showNotificationModal('Ошибка', 'Выберите файл бэкапа', 'error');
        return;
    }
    
    selectedBackupFilename = selectedBackupFilename.replace('.json', '');
    const confirmBtn = document.getElementById('confirm-db-file-btn');
    const originalHtml = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Выбор файла...';
    confirmBtn.disabled = true;
    
    try {
        // Вызываем ручку set_file_name для БД
        const result = await set_file_name()

        
        if (result.success) {
            showNotificationModal(
                'Файл выбран',
                result.message || `Выбран файл: ${selectedBackupFilename}`,
                'success'
            );
            
            // Закрываем модальное окно
            const modal = document.getElementById('db-file-select-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            
            // Обновляем текст кнопки выбора файла на главной странице
            const mainSelectBtn = document.getElementById('select-backup-btn');
            if (mainSelectBtn) {
                mainSelectBtn.innerHTML = `<i class="fas fa-file"></i> ${selectedBackupFilename}`;
                mainSelectBtn.title = `Выбранный файл: ${selectedBackupFilename}`;
            }
            
            selectedBackupFilename = null;
            
        } else {
            showNotificationModal(
                'Ошибка',
                result.error || 'Не удалось выбрать файл',
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
    } finally {
        confirmBtn.innerHTML = originalHtml;
        confirmBtn.disabled = false;
    }
}

// Вспомогательная функция для форматирования даты
function formatBackupDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}