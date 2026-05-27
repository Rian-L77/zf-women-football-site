const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const switchBtns = document.querySelectorAll('.switch-btn');
const playerPanels = document.querySelectorAll('.player-panel');
const copyWechatBtn = document.getElementById('copyWechatBtn');
const wechatId = document.getElementById('wechatId');
const copyTip = document.getElementById('copyTip');
const honorToggles = document.querySelectorAll('.honor-toggle');

menuBtn?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

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
