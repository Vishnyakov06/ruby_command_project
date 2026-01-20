document.addEventListener("DOMContentLoaded", () => {

    window.openModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add("active");
    }

    window.closeModal = function (modal) {
        modal?.classList.remove("active");
    }

    document.addEventListener("click", async (e) => {
        if (e.target.closest("#add-client-btn")) {
            openModal("client-modal");
        }

        if (e.target.closest("#add-master-btn")) {
            openModal("master-modal");
        }

        if (e.target.closest("#add-booking-btn")) {
            await populateClientSelect('booking-client');
            await populateMasterSelect('booking-master');
            await populateServiceSelect('booking-service');
            openModal("booking-modal");
        }

        if (e.target.closest("#add-service-btn")) {
            openModal("service-modal");
        }

        if (e.target.closest("#delete-client-btn")) {
            populateClientDelete();
            openModal("delete-client-modal");
        }

        if (e.target.closest("#delete-master-btn")) {
            populateMasterDelete();
            openModal("delete-master-modal");
        }

        if (e.target.closest("#delete-service-btn")) {
            populateServiceDelete();
            openModal("delete-service-modal");
        }

        if (e.target.closest("#delete-booking-btn")) {
            populateBookingDelete();
            openModal("delete-booking-modal");
        }

        if (e.target.closest("#get-client-btn")) {
            openModal("search-client-modal");
        }

        if (e.target.closest("#get-master-btn")) {
            openModal("search-master-modal");
        }

        if (e.target.closest("#get-service-btn")) {
            openModal("search-service-modal");
        }

        if (e.target.closest("#get-booking-btn")) {
            openModal("search-booking-modal");
        }

        if (e.target.closest("#edit-client-btn")) {
            openModal("edit-client-modal");
        }

        if (e.target.closest("#edit-master-btn")) {
            openModal("edit-master-modal");
        }

        if (e.target.closest("#edit-service-btn")) {
            openModal("edit-service-modal");
        }

        if (e.target.closest("#edit-booking-btn")) {
            openModal("edit-booking-modal");
        }

        if (e.target.closest("#history-list")) {
            openModal("recent-changes-modal");
        }

        if (e.target.closest(".close, .close-modal")) {
            closeModal(e.target.closest(".modal"));
        }

        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    window.showNotificationModal = function(title, message, type = 'info') {
        const modal = document.getElementById('notification-modal');
        if (!modal) {
            console.error('Модальное окно уведомлений не найдено!');
            alert(`${title}: ${message}`);
            return;
        }
        
        // Находим элементы внутри модалки
        const icon = document.getElementById('notification-icon');
        const titleElement = document.getElementById('notification-title');
        const messageElement = document.getElementById('notification-message');
        
        if (!icon || !titleElement || !messageElement) {
            console.error('Элементы модального окна не найдены!');
            return;
        }
        
        // Устанавливаем заголовок и сообщение
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Устанавливаем иконку в зависимости от типа
        const iconClass = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        const iconColorClass = {
            'success': 'notification-icon-success',
            'error': 'notification-icon-error',
            'warning': 'notification-icon-warning',
            'info': 'notification-icon-info'
        }[type] || 'notification-icon-info';
        
        // Обновляем иконку
        icon.className = `fas ${iconClass}`;
        icon.className += ` ${iconColorClass}`;
        
        // Показываем модальное окно
        modal.classList.add('active');
        
        // Добавляем обработчик для кнопки OK и крестика
        const closeButtons = modal.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            // Удаляем старые обработчики чтобы избежать дублирования
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Добавляем новые обработчики
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });
        
        // Закрытие при клике вне окна
        modal.addEventListener('click', function modalClickHandler(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                // Удаляем обработчик после закрытия
                modal.removeEventListener('click', modalClickHandler);
            }
        });
        
        
    };
});