/* ===================== dados da tela ===================== */
const patient = {
  name: 'Carlos Mendes',
  birthDate: '15/04/1985',
  cns: '123 4567 8901 2345',
  issueDate: '12 Nov 2024',
  authentication: '8f92-a1b2-c3d4',
};

const vaccinations = [
  { vaccine: 'COVID-19 (Pfizer)', dose: 'Reforço', date: '10/01/2024', batch: 'PF1234', unit: 'UBS Centro' },
  { vaccine: 'Influenza (Gripe)', dose: 'Única', date: '15/04/2023', batch: 'INF5678', unit: 'Clínica Vida' },
  { vaccine: 'Hepatite B', dose: 'Dose 3', date: '20/08/2022', batch: 'HB9012', unit: 'UBS Norte' },
];

const certificateQr = `Imuniza+ | Prévia demonstrativa | ${patient.name} | ${patient.authentication}`;

/* ===================== estado ===================== */
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
const menuToggle = document.getElementById('menuToggle');
const pageTitle = document.getElementById('pageTitle');
const panelTitle = document.getElementById('panelTitle');
const panelText = document.getElementById('panelText');
const actions = document.getElementById('actions');
const errorBox = document.getElementById('errorBox');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const cancelBtn = document.getElementById('cancelBtn');

let cancelled = false;
let exporting = false;

/* ===================== tabela de imunizações ===================== */
document.getElementById('rows').innerHTML = vaccinations
  .map(row => `<tr><td>${row.vaccine}</td><td><span class="dose">${row.dose}</span></td><td>${row.date}</td><td>${row.batch}</td><td>${row.unit}</td></tr>`)
  .join('');

/* ===================== menu lateral ===================== */
function setMenuOpen(open) {
  sidebar.classList.toggle('open', open);
  scrim.hidden = !open;
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuToggle.innerHTML = `<svg class="icon"><use href="#${open ? 'i-x' : 'i-menu'}" /></svg>`;
}
menuToggle.addEventListener('click', () => setMenuOpen(!sidebar.classList.contains('open')));
scrim.addEventListener('click', () => setMenuOpen(false));

document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    setMenuOpen(false);
  });
});

/* ===================== popovers do topo ===================== */
function bindPopover(triggerId, popoverId) {
  const trigger = document.getElementById(triggerId);
  const popover = document.getElementById(popoverId);
  const close = () => { popover.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
  trigger.addEventListener('click', event => {
    event.stopPropagation();
    const willOpen = popover.hidden;
    document.querySelectorAll('.popover').forEach(p => (p.hidden = true));
    document.querySelectorAll('[aria-expanded]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    popover.hidden = !willOpen;
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
  popover.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', close);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
}
bindPopover('bellBtn', 'bellPop');
bindPopover('userBtn', 'userPop');

/* ===================== QR do comprovante ===================== */
function qrDarkColor() {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--qr');
  const probe = document.createElement('canvas').getContext('2d');
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const pixel = probe.getImageData(0, 0, 1, 1).data;
  return '#' + Array.from(pixel).slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('');
}

import('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm')
  .then(({ default: QRCode }) => QRCode.toCanvas(document.getElementById('qr'), certificateQr, {
    width: 92, margin: 0, color: { dark: qrDarkColor(), light: '#00000000' },
  }))
  .catch(() => {});

/* ===================== PDF ===================== */
async function downloadCertificate() {
  const [{ jsPDF }, { default: QRCode }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/+esm'),
    import('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm'),
  ]);

  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold'); doc.setFontSize(26); doc.text('Imuniza+', 20, 27);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text('Certificado Nacional de Vacinação', 20, 37);
  doc.setFontSize(10); doc.text(`Data de Emissão: ${patient.issueDate}`, 20, 48);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text(patient.name, 20, 70);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  doc.text(`Data de Nasc: ${patient.birthDate}`, 20, 81);
  doc.text(`CNS: ${patient.cns}`, 20, 89);

  const qr = await QRCode.toDataURL(certificateQr, { margin: 1, width: 128 });
  doc.addImage(qr, 'PNG', 155, 62, 25, 25);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('Registro de Imunizações', 20, 113);
  const columns = [20, 74, 101, 133, 160];
  doc.setFontSize(10);
  ['Vacina', 'Dose', 'Data', 'Lote', 'Unidade'].forEach((label, i) => doc.text(label, columns[i], 127));
  doc.setFont('helvetica', 'normal');
  vaccinations.forEach((row, i) => {
    [row.vaccine, row.dose, row.date, row.batch, row.unit]
      .forEach((value, j) => doc.text(value, columns[j], 140 + i * 15));
  });

  doc.setFontSize(11); doc.text('Ministério da Saúde - SUS', 20, 202);
  doc.setFontSize(9); doc.text(`Autenticação: ${patient.authentication}`, 20, 212);
  doc.text('Prévia demonstrativa baseada nos dados do print. Sem validade oficial.', 20, 235);
  doc.save('comprovante-vacinacao-carlos-mendes.pdf');
}

/* ===================== painel de exportação ===================== */
function renderPanel() {
  actions.classList.remove('swap');
  void actions.offsetWidth; // reinicia a animação
  actions.classList.add('swap');
  errorBox.hidden = true;

  if (cancelled) {
    pageTitle.textContent = 'Carteira Completa';
    panelTitle.textContent = 'Comprovante Vacinal';
    panelText.textContent = 'Carlos Mendes';
    actions.innerHTML = `<button class="btn primary export-button" id="restoreBtn">
      <svg class="icon"><use href="#i-download" /></svg>Exportar Comprovante
    </button>`;
    document.getElementById('restoreBtn').addEventListener('click', () => { cancelled = false; renderPanel(); });
    return;
  }

  pageTitle.textContent = 'Exportar Comprovante';
  panelTitle.textContent = 'Opções de Exportação';
  panelText.textContent = 'Escolha como deseja salvar o comprovante vacinal de Carlos Mendes.';
  actions.innerHTML = `
    <button class="btn primary export-button" id="downloadBtn">
      <svg class="icon"><use href="#i-download" /></svg>Download PDF
    </button>
    <button class="btn secondary export-button print-button" id="printBtn">
      <svg class="icon"><use href="#i-printer" /></svg>Imprimir
    </button>
    <button class="btn ghost cancel-button" id="cancelBtn">Cancelar</button>`;

  const download = document.getElementById('downloadBtn');
  download.addEventListener('click', async () => {
    if (exporting) return;
    exporting = true;
    errorBox.hidden = true;
    download.disabled = true;
    download.innerHTML = `<svg class="icon spin"><use href="#i-loader" /></svg>Gerando PDF...`;
    try {
      await downloadCertificate();
    } catch {
      errorBox.textContent = 'Não foi possível baixar o PDF. Tente novamente.';
      errorBox.hidden = false;
    } finally {
      exporting = false;
      download.disabled = false;
      download.innerHTML = `<svg class="icon"><use href="#i-download" /></svg>Download PDF`;
    }
  });
  document.getElementById('printBtn').addEventListener('click', () => window.print());
  document.getElementById('cancelBtn').addEventListener('click', () => {
    cancelled = true;
    document.querySelectorAll('.nav-item').forEach(item =>
      item.classList.toggle('active', item.dataset.label === 'Carteira Completa'));
    renderPanel();
  });
}

renderPanel();
