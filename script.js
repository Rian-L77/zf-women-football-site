const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const switchBtns = document.querySelectorAll('.switch-btn');
const playerPanels = document.querySelectorAll('.player-panel');
const copyWechatBtn = document.getElementById('copyWechatBtn');
const wechatId = document.getElementById('wechatId');
const copyTip = document.getElementById('copyTip');
const honorToggles = document.querySelectorAll('.honor-toggle');

const photoData = {
  '2026': [{ web: './lite-hero-main.jpg', original: './photo-2026-1.jpg', size: '21MB' }],
  '2025': [{ web: './lite-photo-2025-1.jpg', original: './photo-2025-1.jpg', size: '5.7MB' }],
  '2024': [
    { web: './lite-photo-2024-1.jpg', original: './photo-2024-1.jpg', size: '15MB' },
    { web: './lite-photo-2024-2.jpg', original: './photo-2024-2.jpg', size: '14MB' },
    { web: './lite-photo-2024-3.jpg', original: './photo-2024-3.jpg', size: '17MB' }
  ],
  '2023': [
    { web: './lite-photo-2023-1.jpg', original: './photo-2023-1.jpg', size: '6.5MB' },
    { web: './lite-photo-2023-2.jpg', original: './photo-2023-2.jpg', size: '1.1MB' }
  ],
  '2022': [
    { web: './lite-photo-2022-1.jpg', original: './photo-2022-1.jpg', size: '13MB' },
    { web: './lite-photo-2022-2.jpg', original: './photo-2022-2.jpg', size: '464KB' }
  ],
  '2021': [{ web: './lite-photo-2021-1.jpg', original: './photo-2021-1.jpg', size: '8.4MB' }]
};

const photoVersion = '?v=20260528i';
const preloadCache = new Set();
const yearOrder = Object.keys(photoData).sort((a, b) => Number(b) - Number(a));
let currentYear = '2026';
let currentIndex = 0;
let switchingPhoto = false;
let currentOriginal = './hero-main.jpg';
let currentSize = '316KB';

const yearsWrap = document.getElementById('photoYears');
const photoDisplay = document.getElementById('photoDisplay');
const photoDownloadOriginal = document.getElementById('photoDownloadOriginal');
const photoPrev = document.getElementById('photoPrev');
const photoNext = document.getElementById('photoNext');
const photoEmpty = document.getElementById('photoEmpty');

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

function preloadUrl(url) {
  if (!url || preloadCache.has(url)) return;
  const img = new Image();
  img.src = url;
  preloadCache.add(url);
}

function warmupAllLitePhotos() {
  yearOrder.forEach((year) => {
    const list = photoData[year] || [];
    list.forEach((item) => preloadUrl(item.web + photoVersion));
  });
}

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

  switchingPhoto = true;
  photoPrev.disabled = true;
  photoNext.disabled = true;
  photoDisplay.src = item.web + photoVersion;

  currentOriginal = item.original;
  currentSize = item.size;
  photoDisplay.alt = currentYear + '年合照';

  const multiple = list.length > 1;
  photoDisplay.onload = () => {
    switchingPhoto = false;
    photoPrev.disabled = !multiple;
    photoNext.disabled = !multiple;
  };

  if (photoDownloadOriginal) {
    photoDownloadOriginal.href = currentOriginal + photoVersion;
    photoDownloadOriginal.textContent = `点击下载原图（${currentSize}）`;
  }

  photoPrev.style.visibility = multiple ? 'visible' : 'hidden';
  photoNext.style.visibility = multiple ? 'visible' : 'hidden';
  photoEmpty.textContent = multiple ? ('当前第 ' + (currentIndex + 1) + ' / ' + list.length + ' 张') : '该年份暂无更多照片';

  list.forEach((x) => preloadUrl(x.web + photoVersion));
}

photoPrev?.addEventListener('click', () => {
  if (switchingPhoto) return;
  const list = photoData[currentYear] || [];
  if (list.length <= 1) return;
  currentIndex = (currentIndex - 1 + list.length) % list.length;
  renderPhoto();
});

photoNext?.addEventListener('click', () => {
  if (switchingPhoto) return;
  const list = photoData[currentYear] || [];
  if (list.length <= 1) return;
  currentIndex = (currentIndex + 1) % list.length;
  renderPhoto();
});

renderYearButtons();
renderPhoto();
warmupAllLitePhotos();
