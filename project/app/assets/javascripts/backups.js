window.initBackup = function() {
    
    const exportBtn = document.getElementById("export-btn");
    
    exportBtn.addEventListener("click", async function(e) {
        e.preventDefault();
        
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
    });
    
};