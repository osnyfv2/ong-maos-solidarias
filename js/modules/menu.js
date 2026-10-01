/* =========================================================
   Módulo: menu
   Abre e fecha o menu hambúrguer e marca o item da rota ativa.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.menu = (function () {
  let menu, botao;

  function definirEstado(aberto) {
    menu.classList.toggle('menu--aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  function fechar() { if (menu) definirEstado(false); }

  // Destaca o link da rota atual com aria-current="page"
  function marcarAtivo(rota) {
    document.querySelectorAll('.menu__link[data-rota]').forEach(function (link) {
      if (link.dataset.rota === rota) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function atualizarContador(total) {
    document.querySelectorAll('[data-contador-cadastros]').forEach(function (el) {
      el.textContent = total;
      el.hidden = total === 0;
    });
  }

  function iniciar() {
    menu = document.querySelector('.menu');
    botao = document.querySelector('.menu__botao');
    if (!menu || !botao) return;

    botao.addEventListener('click', function () {
      definirEstado(!menu.classList.contains('menu--aberto'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('menu--aberto')) {
        definirEstado(false);
        botao.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) definirEstado(false);
    });
  }

  return { iniciar: iniciar, fechar: fechar, marcarAtivo: marcarAtivo, atualizarContador: atualizarContador };
})();
