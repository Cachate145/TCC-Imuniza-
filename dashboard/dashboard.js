(function(){
  'use strict';

  /* ---------------------------------------------------------
     Toast de feedback (mesmo padrão usado nas outras telas)
  --------------------------------------------------------- */
  function showToast(message){
    const toast = document.createElement('div');
    toast.className = 'imz-toast';
    toast.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.6"/><path d="M8 12.5l2.5 2.5L16 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>' + message + '</span>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  /* ---------------------------------------------------------
     Saudação dinâmica conforme o horário do dia
  --------------------------------------------------------- */
  function setGreeting(){
    const hour = new Date().getHours();
    let greeting = 'Boa noite';
    if (hour >= 5 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    const title = document.getElementById('greetingTitle');
    if (title) title.textContent = greeting + ', visão geral';
  }
  setGreeting();

  /* ---------------------------------------------------------
     Foto de perfil (mesma chave usada em config.html)
  --------------------------------------------------------- */
  function loadAccountPhoto(){
    let photo = null;
    try { photo = localStorage.getItem('imunizaProfilePhoto'); } catch (err) { photo = null; }
    const accountIco = document.getElementById('accountIco');
    if (photo && accountIco){
      accountIco.innerHTML = '<img src="' + photo + '" alt="Foto de perfil">';
    }
  }
  loadAccountPhoto();

  const accountIco = document.getElementById('accountIco');
  if (accountIco){
    accountIco.addEventListener('click', () => { window.location.href = '../config/config.html'; });
    accountIco.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') window.location.href = '../config/config.html';
    });
  }

  /* ---------------------------------------------------------
     Navegação lateral — estado ativo visual
  --------------------------------------------------------- */
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ---------------------------------------------------------
     Contadores animados dos cartões de estatística
  --------------------------------------------------------- */
  function animateCount(el, target, duration, suffix){
    if (!el) return;
    suffix = suffix || '';
    const start = 0;
    const startTime = performance.now();
    function step(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const DASH_DATA = { protection: 85, doses: 14, pending: 2 };

  animateCount(document.getElementById('statProtection'), DASH_DATA.protection, 1200);
  animateCount(document.getElementById('statDoses'), DASH_DATA.doses, 900);
  animateCount(document.getElementById('statPending'), DASH_DATA.pending, 700);

  /* ---------------------------------------------------------
     Botão do Chatbot — pequena transição antes de navegar
  --------------------------------------------------------- */
  const chatbotBtn = document.getElementById('chatbotBtn');
  if (chatbotBtn){
    chatbotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chatbotBtn.style.transform = 'scale(0.96)';
      showToast('Abrindo o assistente virtual...');
      setTimeout(() => {
        window.location.href = chatbotBtn.getAttribute('href');
      }, 350);
    });
  }

  /* ---------------------------------------------------------
     Exportar carteira em PDF (html2canvas + jsPDF)
  --------------------------------------------------------- */
  const exportBtn = document.getElementById('exportBtn');
  const exportBtnLabel = document.getElementById('exportBtnLabel');

  if (exportBtn){
    exportBtn.addEventListener('click', async () => {
      if (exportBtn.disabled) return;

      if (typeof html2canvas === 'undefined' || !window.jspdf){
        showToast('Gerador de PDF indisponível no momento.');
        return;
      }

      const originalLabel = exportBtnLabel.textContent;
      exportBtn.disabled = true;
      exportBtnLabel.innerHTML = '';
      exportBtn.querySelector('svg').classList.add('spin');
      exportBtnLabel.textContent = 'Gerando PDF...';

      try {
        const target = document.getElementById('exportCard');
        const canvas = await html2canvas(target, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, Math.max(pdfHeight, 297)] });
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('carteira-vacinacao-imuniza-plus.pdf');

        showToast('Carteira exportada em PDF com sucesso!');
      } catch (err) {
        console.error(err);
        showToast('Não foi possível gerar o PDF agora.');
      } finally {
        exportBtn.disabled = false;
        exportBtn.querySelector('svg').classList.remove('spin');
        exportBtnLabel.textContent = originalLabel;
      }
    });
  }

})();