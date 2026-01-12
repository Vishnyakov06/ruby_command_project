document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".nav-item");
    const contentArea = document.querySelector(".content-area");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
        const tabName = tab.dataset.tab;
        currentTab = tabName;
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        fetch(`/partials/${tabName}`)
            .then(res => res.text())
            .then(html => {
                if (currentTab !== tabName) return;
                contentArea.innerHTML = html;
                initTab(tabName);
            })
            .catch(err => console.error(err));
        });
    });
});

function initTab(tabName) {
    switch (tabName) {
        case "clients":
            loadClients();
            break;
        case "masters":
            loadMasters();
            break;
        case "bookings":
            loadBookings();
            break;
        case "services":
            loadServices();
            break;
    }
}


