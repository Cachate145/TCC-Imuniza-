  // ---- sidebar navigation (visual active state) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ---- export PDF button (placeholder action) ----
  const exportBtn = document.querySelector('.btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      alert('Exportando carteira de vacinação em PDF (ação simulada).');
    });
  }