  // ---- sidebar nav active state (visual only, links keep working) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // ---- add profile actions ----
  document.getElementById('addProfileBtn').addEventListener('click', () => {
    window.location.href = '../adicionar-perfil/adicionar-perfil.html';
  });
  document.getElementById('addProfileCard').addEventListener('click', () => {
    window.location.href = '../adicionar-perfil/adicionar-perfil.html';
  });

  // ---- toast feedback ----
  function showToast(message){
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:22px;right:22px;background:linear-gradient(135deg,var(--green-800),var(--green-700));color:#fff;padding:12px 20px;border-radius:12px;box-shadow:0 14px 34px rgba(15,45,38,0.28);font-size:13.5px;font-weight:700;display:flex;align-items:center;gap:9px;z-index:999;opacity:0;transform:translateY(8px);transition:opacity .25s ease, transform .25s ease;';
    toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' + message + '</span>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  // ---- render profiles saved from "Adicionar Perfil Familiar" ----
  const AVATAR_COLORS = ['a1','a2','a3','a4','a5','a6'];
  const profilesGrid = document.querySelector('.profiles-grid');
  const addProfileCard = document.getElementById('addProfileCard');

  function getInitials(name){
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }

  function ageSubLabel(profile){
    if (profile.age === null || profile.age === undefined) return '';
    if (profile.age <= 0) return 'menos de 1 ano';
    return profile.age === 1 ? '1 ano' : profile.age + ' anos';
  }

  function loadStoredProfiles(){
    try {
      return JSON.parse(localStorage.getItem('imunizaFamilyProfiles')) || [];
    } catch (err) {
      return [];
    }
  }

  function saveStoredProfiles(profiles){
    try {
      localStorage.setItem('imunizaFamilyProfiles', JSON.stringify(profiles));
    } catch (err) {
      console.warn('Não foi possível salvar os perfis localmente.', err);
    }
  }

  function buildProfileCard(profile, colorClass){
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.setAttribute('data-profile-id', profile.id);

    const ageText = ageSubLabel(profile);
    const subLine = [profile.relationshipLabel, ageText].filter(Boolean).join(' • ');
    const cpfLine = profile.cpf ? `<span class="pc-cpf">CPF: ${profile.cpf}</span>` : '';
    const avatarInner = profile.photo
      ? `<img src="${profile.photo}" alt="${profile.name}">`
      : getInitials(profile.name);

    card.innerHTML = `
      <div class="pc-head">
        <div class="pc-avatar-wrap">
          <div class="avatar ${colorClass}">${avatarInner}</div>
          <div class="pc-name">
            <strong>${profile.name}</strong>
            <span class="sub">${subLine}</span>
            ${cpfLine}
          </div>
        </div>
        <button class="menu-btn" title="Mais opções">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/></svg>
        </button>
      </div>

      <div class="status-row">
        <div class="status-left">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#1a9c74"/><path d="M7 12.5l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Status Vacinal
        </div>
        <span class="status-pill ok">Perfil criado</span>
      </div>

      <button class="btn-ver-carteira" data-target="../carteira/carteira.html">Ver Carteira</button>
    `;
    return card;
  }

  function renderStoredProfiles(){
    profilesGrid.querySelectorAll('.profile-card[data-profile-id]').forEach(el => el.remove());
    const profiles = loadStoredProfiles();
    profiles.forEach((profile, i) => {
      const card = buildProfileCard(profile, AVATAR_COLORS[i % AVATAR_COLORS.length]);
      profilesGrid.insertBefore(card, addProfileCard);
    });
  }

  renderStoredProfiles();

  // ---- event delegation: Ver Carteira + menu (works for static and dynamic cards) ----
  profilesGrid.addEventListener('click', (e) => {
    const verBtn = e.target.closest('.btn-ver-carteira');
    if (verBtn){
      const target = verBtn.getAttribute('data-target');
      if (target) window.location.href = target;
      return;
    }

    const menuBtn = e.target.closest('.menu-btn');
    if (menuBtn){
      e.stopPropagation();
      const card = menuBtn.closest('.profile-card[data-profile-id]');
      if (card){
        const id = card.getAttribute('data-profile-id');
        if (confirm('Remover este perfil familiar?')){
          const profiles = loadStoredProfiles().filter(p => p.id !== id);
          saveStoredProfiles(profiles);
          renderStoredProfiles();
          showToast('Perfil removido.');
        }
      } else {
        alert('Opções do perfil (editar, remover) — ação simulada.');
      }
    }
  });