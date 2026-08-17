  // ---- toolbar pills toggle (independent, non-exclusive style) ----
  ['abertosPill','vacinaPill','mapaPill'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('click', () => el.classList.toggle('active'));
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

  // ---- open Google Maps for "Como Chegar" / "Traçar Rota" ----
  function openInGoogleMaps(address){
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    window.open(url, '_blank', 'noopener');
  }
  document.querySelectorAll('.btn-como-chegar, .btn-tracar').forEach(btn => {
    btn.addEventListener('click', () => {
      const address = btn.getAttribute('data-address');
      if (address) openInGoogleMaps(address);
    });
  });

  // ---- simple search filter over posto cards ----
  const searchInput = document.getElementById('searchInput');
  const postoCards = document.querySelectorAll('.featured-card, .posto-card');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    postoCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  });