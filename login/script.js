  // ---- CPF mask ----
  const cpfInput = document.getElementById('cpf');
  cpfInput.addEventListener('input', () => {
    let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = v;
  });

  // ---- toggle password visibility ----
  const senhaInput = document.getElementById('senha');
  const toggleEye = document.getElementById('toggleEye');
  const eyeIcon = document.getElementById('eyeIcon');
  toggleEye.addEventListener('click', () => {
    const isPw = senhaInput.type === 'password';
    senhaInput.type = isPw ? 'text' : 'password';
    eyeIcon.innerHTML = isPw
      ? '<path d="M2 12s0-1 1-2.5M22 12s-4 7-10 7c-1.6 0-3-.4-4.3-1M9 4.6C10 4.2 11 4 12 4c6 0 10 7 10 7 0 0-.6 1.1-1.7 2.4M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>';
  });

  // ---- CPF validation (checksum) ----
  function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let rev = (sum * 10) % 11;
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    rev = (sum * 10) % 11;
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(cpf[10]);
  }

  // ---- "Entrar na conta" link click ----
  const submitBtn = document.getElementById('submitBtn');
  const cpfField = document.getElementById('cpfField');
  const senhaField = document.getElementById('senhaField');

  submitBtn.addEventListener('click', (e) => {
    let valid = true;

    if (!isValidCPF(cpfInput.value)) {
      cpfField.classList.add('has-error');
      valid = false;
    } else {
      cpfField.classList.remove('has-error');
    }

    if (senhaInput.value.length < 6) {
      senhaField.classList.add('has-error');
      valid = false;
    } else {
      senhaField.classList.remove('has-error');
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    submitBtn.classList.add('is-disabled');
    submitBtn.innerHTML = 'Entrando...';
  });

  cpfInput.addEventListener('input', () => cpfField.classList.remove('has-error'));
  senhaInput.addEventListener('input', () => senhaField.classList.remove('has-error'));

  // ---- gov.br button ----
  document.getElementById('govBtn').addEventListener('click', () => {
    alert('Redirecionando para autenticação gov.br (simulado).');
  });