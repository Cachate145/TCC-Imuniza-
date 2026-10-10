  // ---- sidebar nav active state (visual only, links keep working) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // ---- support button (placeholder) ----
  document.getElementById('supportBtn').addEventListener('click', () => {
    alert('Abrindo chat com o suporte (ação simulada).');
  });