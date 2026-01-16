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
            openModal("delete-service-modal");
        }

        if (e.target.closest("#delete-booking-btn")) {
            openModal("delete-booking-modal");
        }

        if (e.target.closest(".close, .close-modal")) {
            closeModal(e.target.closest(".modal"));
        }

        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });
});