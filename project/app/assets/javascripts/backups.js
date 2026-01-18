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