const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const switchBtns = document.querySelectorAll('.switch-btn');
const playerPanels = document.querySelectorAll('.player-panel');

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
