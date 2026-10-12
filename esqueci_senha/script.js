  // ---- CPF mask ----
  const cpfInput = document.getElementById('cpf');
  cpfInput.addEventListener('input', () => {
    let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    cpfInput.value = v;
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

  // ---- Form submission & validation ----
  const recoveryForm = document.getElementById('recoveryForm');
  const submitBtn = document.getElementById('submitBtn');
  const cpfField = document.getElementById('cpfField');
  const formContainer = document.getElementById('formContainer');
  const successBox = document.getElementById('successBox');

  recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isValidCPF(cpfInput.value)) {
      cpfField.classList.add('has-error');
      return;
    } else {
      cpfField.classList.remove('has-error');
    }

    submitBtn.classList.add('is-disabled');
    submitBtn.innerHTML = 'Enviando instruções...';

    // Simulação de envio com sucesso após 1.2 segundos
    setTimeout(() => {
      formContainer.style.display = 'none';
      successBox.style.display = 'block';
    }, 1200);
  });

  cpfInput.addEventListener('input', () => cpfField.classList.remove('has-error'));