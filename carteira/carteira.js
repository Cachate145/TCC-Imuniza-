  // ---- filter pills ----
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // ---- sidebar nav active state (visual only, links keep working) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // ---- export / QR buttons (placeholder actions) ----
  document.getElementById('exportBtn').addEventListener('click', () => {
    alert('Exportando carteira de vacinação em PDF (ação simulada).');
  });
  document.getElementById('qrBtn').addEventListener('click', () => {
    alert('Gerando QR Code do certificado digital (ação simulada).');
  });

  // ---- simple search filter over record cards ----
  const searchInput = document.getElementById('searchInput');
  const recordCards = document.querySelectorAll('.record-card');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    recordCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  });