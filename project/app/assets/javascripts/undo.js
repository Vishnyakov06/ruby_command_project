document.addEventListener('keydown', async function(e) {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key === 'я')) {
        e.preventDefault();
        await undo();
    }
});

async function undo() {
    try {
        const response = await fetch(`${API_BASE}/undo`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        if (!response.ok) throw new Error('Ошибка Ctrl+Z');

        const data = await response.json();
        console.log('[Undo]', data.undone);

        renderRecentChanges(data.history);
        initTab(currentTab)

    } catch (err) {
        console.error('[Undo]', err);
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.closest("#history-list")) {
        try {
            const history = await getUndoHistory();
            renderRecentChanges(history);
        } catch (err) {
            console.error('[Recent Changes]', err);
            const recentChangesList = document.getElementById('recent-changes-list');
            if (recentChangesList) {
                recentChangesList.innerHTML = `<p style="text-align:center; color:#dc3545;">Ошибка загрузки истории</p>`;
            }
        }
    }
});

function renderRecentChanges(history) {
    const recentChangesList = document.getElementById('recent-changes-list');
    if (!recentChangesList) return;

    recentChangesList.innerHTML = '';

    if (!history || history.length === 0) {
        recentChangesList.innerHTML = '<p style="text-align:center; color:#555;">Нет последних команд</p>';
        return;
    }

    history.forEach((command, index) => {
        const snapshot = command.snapshot || {};
        const fullName = [snapshot.last_name, snapshot.first_name, snapshot.patronymic].filter(Boolean).join(' ');

        const item = document.createElement('div');
        item.className = 'recent-change-item';
        item.style.padding = '8px 12px';
        item.style.borderBottom = '1px solid #eee';
        item.style.borderRadius = '4px';
        item.style.marginBottom = '4px';
        item.style.backgroundColor = '#fafafa';
        item.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';

        item.innerHTML = `
            <strong>${index + 1}. ${command.type.toUpperCase()}</strong> — ${command.entity}
        `;

        recentChangesList.appendChild(item);
    });
}
