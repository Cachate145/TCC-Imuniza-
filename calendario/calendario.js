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

  // ---- render appointments booked in "Agendar Vacina" ----
  function loadAppointments(){
    try {
      return JSON.parse(localStorage.getItem('imunizaAppointments')) || [];
    } catch (err) {
      return [];
    }
  }
  function saveAppointments(list){
    try { localStorage.setItem('imunizaAppointments', JSON.stringify(list)); } catch (err) {}
  }

  const userAppointmentsGroup = document.getElementById('userAppointmentsGroup');
  const next30Stat = document.querySelector('.stat-card:not(.late) .big');
  const baseNext30 = next30Stat ? parseInt(next30Stat.textContent, 10) || 0 : 0;

  function renderAppointments(){
    const appointments = loadAppointments();
    userAppointmentsGroup.innerHTML = '';

    if (appointments.length === 0){
      if (next30Stat) next30Stat.textContent = baseNext30;
      return;
    }

    if (next30Stat) next30Stat.textContent = baseNext30 + appointments.length;

    const group = document.createElement('div');
    group.className = 'tl-group';
    group.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-label">MEUS AGENDAMENTOS</div>
    `;

    appointments
      .slice()
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .forEach(appt => {
        const card = document.createElement('div');
        card.className = 'tl-card';
        card.style.marginBottom = '14px';
        card.innerHTML = `
          <div class="tl-icon teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.9L2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
          </div>
          <div class="tl-body">
            <div class="tl-title-row">
              <strong>${appt.vaccineLabel || 'Vacina'}</strong>
              <span class="tl-badge scheduled">AGENDADA</span>
            </div>
            <div class="tl-desc">Para: <strong style="color:var(--ink);">${appt.patientName || appt.patientFull || '—'}</strong> · ${appt.posto || 'Posto de saúde'}</div>
            <span class="tl-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              ${appt.dateLabel || ''} às ${appt.time || ''}
            </span>
            <div>
              <button type="button" class="tl-remove" data-id="${appt.id}">Cancelar agendamento</button>
            </div>
          </div>
        `;
        group.appendChild(card);
      });

    userAppointmentsGroup.appendChild(group);

    userAppointmentsGroup.querySelectorAll('.tl-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Cancelar este agendamento?')) return;
        const remaining = loadAppointments().filter(a => a.id !== btn.getAttribute('data-id'));
        saveAppointments(remaining);
        renderAppointments();
      });
    });
  }

  renderAppointments();