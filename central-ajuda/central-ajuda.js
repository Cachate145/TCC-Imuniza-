  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
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

  // ---- category cards without a dedicated page yet ----
  const topicLabels = {
    'primeiros-passos': 'Primeiros Passos',
    'agendamentos': 'Agendamentos',
    'certificados': 'Certificados',
    'privacidade': 'Privacidade e Segurança'
  };
  document.querySelectorAll('.cat-card[data-topic]').forEach(card => {
    card.addEventListener('click', () => {
      showToast('Guia de "' + topicLabels[card.getAttribute('data-topic')] + '" em breve.');
    });
  });

  // ---- search (filters categories and FAQ) ----
  const helpSearch = document.getElementById('helpSearch');
  helpSearch.addEventListener('input', () => {
    const term = helpSearch.value.trim().toLowerCase();
    document.querySelectorAll('.cat-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(term) ? '' : '/privacidade_e_segurança/index.html';
    });
    document.querySelectorAll('.faq-item').forEach(item => {
      item.style.display = item.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });

  // ---- footer links (placeholder) ----
  ['termsLink','privacyLink','cookiesLink'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Abrindo documento...');
    });
  });