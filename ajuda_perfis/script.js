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

  document.getElementById('faqBtn').addEventListener('click', () => showToast('Abrindo Perguntas Frequentes...'));
  document.getElementById('supportBtn').addEventListener('click', () => showToast('Conectando com nossa equipe de suporte...'));