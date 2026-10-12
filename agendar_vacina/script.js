  // ---- vaccine options per member (mock) ----
  const vaccinesByMember = {
    ana: [{v:'covid', l:'COVID-19 (Reforço Anual)'}, {v:'flu', l:'Influenza (Gripe)'}],
    lucas: [{v:'hepb', l:'Hepatite B - 3ª Dose'}, {v:'penta', l:'Pentavalente - Reforço'}],
    maria: [{v:'flu', l:'Influenza (Gripe)'}, {v:'pneumo', l:'Pneumocócica 23'}]
  };
  const memberLabels = {ana:'Ana Silva', lucas:'Lucas Silva', maria:'Maria Costa'};

  // vacinas padrão sugeridas para membros adicionados em "Perfis Familiares"
  // (ainda sem histórico próprio registrado no sistema)
  const defaultVaccineOptions = [
    {v:'flu', l:'Influenza (Gripe)'},
    {v:'covid', l:'COVID-19 (Reforço Anual)'},
    {v:'scr', l:'Tríplice Viral (SCR)'}
  ];

  // ---- carrega membros adicionados em "Adicionar Perfil Familiar" ----
  const memberSelect = document.getElementById('memberSelect');

  function loadFamilyMembersIntoSelect(){
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem('imunizaFamilyProfiles')) || [];
    } catch (err) {
      stored = [];
    }
    stored.forEach(profile => {
      memberLabels[profile.id] = profile.name;
      vaccinesByMember[profile.id] = defaultVaccineOptions;
      const opt = document.createElement('option');
      opt.value = profile.id;
      opt.textContent = profile.relationshipLabel
        ? `${profile.name} (${profile.relationshipLabel})`
        : profile.name;
      memberSelect.appendChild(opt);
    });
  }
  loadFamilyMembersIntoSelect();

  const vaccineSelect = document.getElementById('vaccineSelect');
  const dateInput = document.getElementById('dateInput');
  const slotsGrid = document.getElementById('slotsGrid');
  const confirmBtn = document.getElementById('confirmBtn');

  const sumPatient = document.getElementById('sumPatient');
  const sumVaccine = document.getElementById('sumVaccine');
  const sumLocal = document.getElementById('sumLocal');
  const sumDateTime = document.getElementById('sumDateTime');

  let selectedPosto = null;
  let selectedSlot = null;

  function setSummary(el, text){
    if (text){
      el.textContent = text;
      el.classList.remove('placeholder');
    } else {
      el.textContent = '—';
      el.classList.add('placeholder');
    }
  }

  function checkReady(){
    const ready = memberSelect.value && vaccineSelect.value && selectedPosto && dateInput.value && selectedSlot;
    confirmBtn.disabled = !ready;
    confirmBtn.classList.toggle('ready', !!ready);
  }

  // ---- member -> vaccine options ----
  memberSelect.addEventListener('change', () => {
    const member = memberSelect.value;
    vaccineSelect.innerHTML = '';
    if (!member){
      vaccineSelect.disabled = true;
      vaccineSelect.innerHTML = '<option value="" selected>Selecione um membro primeiro</option>';
      setSummary(sumPatient, null);
      setSummary(sumVaccine, null);
      checkReady();
      return;
    }
    vaccineSelect.disabled = false;
    const opts = vaccinesByMember[member] || [];
    vaccineSelect.innerHTML = '<option value="" selected>Selecione uma vacina...</option>' +
      opts.map(o => `<option value="${o.v}">${o.l}</option>`).join('');
    setSummary(sumPatient, memberLabels[member]);
    setSummary(sumVaccine, null);
    checkReady();
  });

  vaccineSelect.addEventListener('change', () => {
    const selectedOption = vaccineSelect.options[vaccineSelect.selectedIndex];
    setSummary(sumVaccine, vaccineSelect.value ? selectedOption.textContent : null);
    checkReady();
  });

  // ---- posto selection ----
  document.querySelectorAll('.posto-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.posto-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPosto = card.getAttribute('data-posto');
      setSummary(sumLocal, selectedPosto);
      checkReady();
    });
  });

  // ---- date + time slots ----
  function updateDateTimeSummary(){
    if (dateInput.value && selectedSlot){
      const d = new Date(dateInput.value + 'T00:00:00');
      const formatted = d.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'});
      setSummary(sumDateTime, `${formatted} às ${selectedSlot}`);
    } else {
      setSummary(sumDateTime, null);
    }
  }

  dateInput.addEventListener('change', () => {
    updateDateTimeSummary();
    checkReady();
  });

  slotsGrid.querySelectorAll('.slot-btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      slotsGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.textContent;
      updateDateTimeSummary();
      checkReady();
    });
  });

  // ---- confirm booking ----
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

  confirmBtn.addEventListener('click', () => {
    if (confirmBtn.disabled) return;

    const selectedPatientOption = memberSelect.options[memberSelect.selectedIndex];
    const selectedVaccineOption = vaccineSelect.options[vaccineSelect.selectedIndex];
    const selectedPostoCard = document.querySelector('.posto-card.selected');
    const address = selectedPostoCard ? selectedPostoCard.getAttribute('data-addr') : '';

    const d = new Date(dateInput.value + 'T00:00:00');
    const dateLabelShort = d.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'});
    const dateLabelFull = d.toLocaleDateString('pt-BR'); // dd/mm/aaaa

    const appointment = {
      id: 'ag_' + Date.now(),
      patientId: memberSelect.value,
      patientName: selectedPatientOption ? selectedPatientOption.textContent.replace(/\s*\([^)]*\)\s*$/, '').trim() : '',
      patientFull: selectedPatientOption ? selectedPatientOption.textContent : '',
      vaccineLabel: selectedVaccineOption ? selectedVaccineOption.textContent : '',
      posto: selectedPosto,
      address: address,
      date: dateInput.value,
      dateLabel: dateLabelFull,
      dateLabelShort: dateLabelShort,
      time: selectedSlot,
      createdAt: Date.now()
    };

    // save into the list of appointments shown on "Calendário Vacinal"
    let appointments = [];
    try {
      appointments = JSON.parse(localStorage.getItem('imunizaAppointments')) || [];
    } catch (err) { appointments = []; }
    appointments.push(appointment);
    try { localStorage.setItem('imunizaAppointments', JSON.stringify(appointments)); } catch (err) {}

    // save the last appointment separately, for the confirmation screen
    try { localStorage.setItem('imunizaLastAppointment', JSON.stringify(appointment)); } catch (err) {}

    showToast('Agendamento confirmado com sucesso!');
    setTimeout(() => { window.location.href = '/agendamento-confirmado/agendamento-confirmado.html'; }, 700);
  });