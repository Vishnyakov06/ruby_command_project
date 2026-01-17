document.addEventListener('keydown', function(e) {
  const target = e.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

  if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key === 'я')) {
    e.preventDefault();

    fetch('/undo', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(res => {
      location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('Ошибка при отмене операции');
    });
  }
});