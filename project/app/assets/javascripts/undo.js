document.addEventListener('keydown', async function(e) {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key === 'я')) {
        e.preventDefault();

        await undo()
        .then(res => {
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Ошибка при отмене операции');
        });
    }
});