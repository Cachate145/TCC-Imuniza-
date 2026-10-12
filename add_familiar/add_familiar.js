  // ---- photo upload preview ----
  const photoInput = document.getElementById('photoInput');
  const photoUpload = document.querySelector('.photo-upload');
  let photoDataUrl = null;
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoDataUrl = e.target.result;
      photoUpload.style.backgroundImage = `url(${photoDataUrl})`;
      photoUpload.style.backgroundSize = 'cover';
      photoUpload.style.backgroundPosition = 'center';
      photoUpload.innerHTML = '';
      photoUpload.style.border = '2px solid var(--green-accent)';
    };
    reader.readAsDataURL(file);
  });

  // ---- gender pills ----
  let selectedGender = '';
  document.querySelectorAll('.gender-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.gender-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedGender = pill.getAttribute('data-value');
      pill.closest('.field-group').querySelector('.field-hint')?.classList.remove('field-error');
    });
  });

  // ---- cpf mask ----
  document.getElementById('cpf').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
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

  // ---- relationship labels ----
  const relationshipLabels = {
    'filho': 'Filho(a)',
    'conjuge': 'Cônjuge',
    'mae-pai': 'Mãe / Pai',
    'irmao': 'Irmão(ã)',
    'avo': 'Avô / Avó',
    'outro': 'Outro'
  };

  function calcAge(birthDateStr){
    if (!birthDateStr) return null;
    const birth = new Date(birthDateStr + 'T00:00:00');
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  // ---- form submit ----
  document.getElementById('addProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedGender) {
      showToast('Selecione o gênero biológico para continuar.');
      document.getElementById('genderPills').scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const cpf = document.getElementById('cpf').value.trim();
    const relationship = document.getElementById('relationship').value;

    const profile = {
      id: 'p_' + Date.now(),
      name: fullName,
      birthDate: birthDate,
      age: calcAge(birthDate),
      cpf: cpf,
      relationship: relationship,
      relationshipLabel: relationshipLabels[relationship] || 'Familiar',
      gender: selectedGender,
      photo: photoDataUrl,
      createdAt: Date.now()
    };

    let profiles = [];
    try {
      profiles = JSON.parse(localStorage.getItem('imunizaFamilyProfiles')) || [];
    } catch (err) {
      profiles = [];
    }
    profiles.push(profile);
    try {
      localStorage.setItem('imunizaFamilyProfiles', JSON.stringify(profiles));
    } catch (err) {
      console.warn('Não foi possível salvar o perfil localmente.', err);
    }

    showToast('Perfil familiar adicionado com sucesso!');
    setTimeout(() => { window.location.href = '/perfis/perfis.html'; }, 900);
  });

  // ---- cancel ----
  document.getElementById('cancelBtn').addEventListener('click', () => {
    window.location.href = '/perfis/perfis.html';
  });