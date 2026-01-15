document.addEventListener("DOMContentLoaded", () => {

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
  }

  function closeModal(modal) {
    modal?.classList.remove("active");
  }

  document.addEventListener("click", (e) => {

    if (e.target.closest("#add-client-btn")) {
      openModal("client-modal");
    }

    if (e.target.closest("#add-master-btn")) {
      openModal("master-modal");
    }

    if (e.target.closest("#add-booking-btn")) {
      openModal("booking-modal");
    }

    if (e.target.closest("#add-service-btn")) {
      openModal("service-modal");
    }

    if (e.target.closest(".close, .close-modal")) {
      closeModal(e.target.closest(".modal"));
    }

    if (e.target.classList.contains("modal")) {
      closeModal(e.target);
    }

  });
});
