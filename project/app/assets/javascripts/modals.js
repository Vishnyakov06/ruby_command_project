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
            await populateClientSelect();
            await populateMasterSelect();
            await populateServiceSelect();
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

        if (e.target.closest(".close, .close-modal")) {
            closeModal(e.target.closest(".modal"));
        }

        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });
});