document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();

    fetch('/undo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(`Отменено: ${data.message}`);
      } else {
        showToast(`Нечего отменять`);
      }
    });
  }
});

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = 'rgba(0,0,0,0.8)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
