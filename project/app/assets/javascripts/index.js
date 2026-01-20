document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".nav-item");
    const contentArea = document.querySelector(".content-area");
    
    function switchTab(tabName) {
        if (!tabName) return;
        
        currentTab = tabName;
        tabs.forEach(t => t.classList.remove("active"));
        const activeTab = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add("active");
        }
        
        fetch(`/partials/${tabName}`)
            .then(res => res.text())
            .then(html => {
                if (currentTab !== tabName) return;
                contentArea.innerHTML = html;
                initTab(tabName);
                saveActiveTab(tabName);
            })
            .catch(err => console.error("Ошибка загрузки вкладки:", err));
    }
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
    
    const savedTab = loadActiveTab();
    if (savedTab && savedTab !== currentTab) {
        switchTab(savedTab);
    }
});

function saveActiveTab(tabName) {
    localStorage.setItem('activeTab', tabName);
}

function loadActiveTab() {
    return localStorage.getItem('activeTab') || 'dashboard';
}

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
    }
}

let currentTab = 'dashboard';