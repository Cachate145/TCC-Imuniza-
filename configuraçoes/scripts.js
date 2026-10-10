  // ---- sidebar nav active state (visual only, links keep working) ----
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!item.getAttribute('href')) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // ---- privacy toggle label sync ----
  const privacyToggle = document.getElementById('privacyToggle');
  const privacyLabel = document.getElementById('privacyLabel');
  privacyToggle.addEventListener('change', () => {
    privacyLabel.textContent = privacyToggle.checked ? 'Permitido' : 'Não permitido';
    privacyLabel.style.color = privacyToggle.checked ? 'var(--green-700)' : '#9aa6a3';
  });

  // ---- save / update actions (placeholder) ----
  document.getElementById('saveDataBtn').addEventListener('click', () => {
    alert('Dados pessoais salvos (ação simulada).');
  });
  document.getElementById('updatePasswordBtn').addEventListener('click', () => {
    const atual = document.getElementById('senhaAtual').value;
    const nova = document.getElementById('novaSenha').value;
    const conf = document.getElementById('confirmaSenha').value;
    if (!atual || !nova || !conf) {
      alert('Preencha todos os campos de senha.');
      return;
    }
    if (nova.length < 8) {
      alert('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (nova !== conf) {
      alert('A confirmação não corresponde à nova senha.');
      return;
    }
    alert('Senha atualizada com sucesso (ação simulada).');
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmaSenha').value = '';
  });

  // ---- delete account (placeholder, requires confirmation) ----
  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    const confirmDelete = confirm('Tem certeza que deseja solicitar a exclusão da sua conta? Esta ação é irreversível e removerá permanentemente seu histórico vacinal.');
    if (confirmDelete) {
      alert('Solicitação de exclusão enviada (ação simulada).');
    }
  });