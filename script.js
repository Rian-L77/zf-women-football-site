const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const switchBtns = document.querySelectorAll('.switch-btn');
const playerPanels = document.querySelectorAll('.player-panel');
const copyWechatBtn = document.getElementById('copyWechatBtn');
const wechatId = document.getElementById('wechatId');
const copyTip = document.getElementById('copyTip');
const honorToggles = document.querySelectorAll('.honor-toggle');

const photoData = {
  '2026': [{ web: './web-hero-main.jpg', original: './hero-main.jpg' }],
  '2025': [{ web: './web-photo-2025-1.jpg', original: './photo-2025-1.jpg' }],
  '2024': [
    { web: './web-photo-2024-1.jpg', original: './photo-2024-1.jpg' },
    { web: './web-photo-2024-2.jpg', original: './photo-2024-2.jpg' },
    { web: './web-photo-2024-3.jpg', original: './photo-2024-3.jpg' }
  ],
  '2023': [
    { web: './web-photo-2023-1.jpg', original: './photo-2023-1.jpg' },
    { web: './web-photo-2023-2.jpg', original: './photo-2023-2.jpg' }
  ],
  '2022': [
    { web: './web-photo-2022-1.jpg', original: './photo-2022-1.jpg' },
    { web: './web-photo-2022-2.jpg', original: './photo-2022-2.jpg' }
  ],
  '2021': [{ web: './web-photo-2021-1.jpg', original: './photo-2021-1.jpg' }]
};

const yearOrder = Object.keys(photoData).sort((a, b) => Number(b) - Number(a));
let currentYear = '2026';
let currentIndex = 0;
let currentOriginal = './hero-main.jpg';

const yearsWrap = document.getElementById('photoYears');
const photoDisplay = document.getElementById('photoDisplay');
const photoOriginal = document.getElementById('photoOriginal');
const photoPrev = document.getElementById('photoPrev');
const photoNext = document.getElementById('photoNext');
const photoEmpty = document.getElementById('photoEmpty');
const photoModal = document.getElementById('photoModal');
const photoModalMask = document.getElementById('photoModalMask');
const photoModalClose = document.getElementById('photoModalClose');
const photoModalImage = document.getElementById('photoModalImage');
const photoSaveBtn = document.getElementById('photoSaveBtn');

menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));

switchBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    switchBtns.forEach((b) => b.classList.remove('active'));
    playerPanels.forEach((panel) => panel.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-target');
    document.getElementById(target)?.classList.add('active');
  });
});

honorToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const panel = document.getElementById(targetId);
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    btn.classList.toggle('active', !expanded);
    panel?.classList.toggle('active', !expanded);
  });
});

copyWechatBtn?.addEventListener('click', async () => {
  const text = wechatId?.textContent?.trim() || 'Dream_Lars';
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      copyTip.textContent = '复制成功';
      return;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    copyTip.textContent = ok ? '复制成功' : '复制失败，请手动复制: ' + text;
  } catch {
    copyTip.textContent = '复制失败，请手动复制: ' + text;
  }
});

function renderYearButtons() {
  if (!yearsWrap) return;
  yearsWrap.innerHTML = '';
  yearOrder.forEach((year) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = year;
    b.className = 'year-btn' + (year === currentYear ? ' active' : '');
    b.addEventListener('click', () => {
      currentYear = year;
      currentIndex = 0;
      renderYearButtons();
      renderPhoto();
    });
    yearsWrap.appendChild(b);
  });
}

function renderPhoto() {
  const list = photoData[currentYear] || [];
  if (!photoDisplay || !photoPrev || !photoNext || !photoEmpty || !list.length) return;
  const item = list[currentIndex];
  photoDisplay.src = item.web;
  currentOriginal = item.original;
  photoDisplay.alt = currentYear + '年合照';

  const multiple = list.length > 1;
  photoPrev.style.visibility = multiple ? 'visible' : 'hidden';
  photoNext.style.visibility = multiple ? 'visible' : 'hidden';
  photoPrev.disabled = !multiple;
  photoNext.disabled = !multiple;
  photoEmpty.textContent = multiple ? ('当前第 ' + (currentIndex + 1) + ' / ' + list.length + ' 张') : '该年份暂无更多照片';
}

photoPrev?.addEventListener('click', () => {
  const list = photoData[currentYear] || [];
  if (list.length <= 1) return;
  currentIndex = (currentIndex - 1 + list.length) % list.length;
  renderPhoto();
});

photoNext?.addEventListener('click', () => {
  const list = photoData[currentYear] || [];
  if (list.length <= 1) return;
  currentIndex = (currentIndex + 1) % list.length;
  renderPhoto();
});

photoOriginal?.addEventListener('click', () => {
  if (!photoModal || !photoModalImage || !photoSaveBtn) return;
  photoModalImage.src = currentOriginal;
  photoSaveBtn.href = currentOriginal;
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
});

function closePhotoModal() {
  if (!photoModal) return;
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden', 'true');
}

photoModalMask?.addEventListener('click', closePhotoModal);
photoModalClose?.addEventListener('click', closePhotoModal);

renderYearButtons();
renderPhoto();
