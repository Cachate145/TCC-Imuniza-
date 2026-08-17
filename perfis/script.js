  // ---- sidebar nav active state (visual only, links keep working) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // ---- "Ver Carteira" buttons navigate to carteira.html ----
  document.querySelectorAll('.btn-ver-carteira').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) window.location.href = target;
    });
  });

  // ---- add profile actions (placeholder) ----
  document.getElementById('addProfileBtn').addEventListener('click', () => {
    alert('Abrindo formulário para adicionar novo perfil (ação simulada).');
  });
  document.getElementById('addProfileCard').addEventListener('click', () => {
    alert('Abrindo formulário para adicionar novo perfil (ação simulada).');
  });

  // ---- menu buttons (placeholder) ----
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Opções do perfil (editar, remover) — ação simulada.');
    });
  });