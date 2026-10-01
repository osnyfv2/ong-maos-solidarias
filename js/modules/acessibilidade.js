/* =========================================================
   Módulo: acessibilidade
   Modo de alto contraste: alterna o atributo data-contraste
   no <html>, guarda a escolha no localStorage e respeita a
   preferência do sistema (prefers-contrast: more).
   ========================================================= */
window.ONG = window.ONG || {};

ONG.acessibilidade = (function () {
  const CHAVE = 'maos-solidarias:contraste';
  let botao;

  function aplicar(ativo) {
    if (ativo) document.documentElement.setAttribute('data-contraste', 'alto');
    else document.documentElement.removeAttribute('data-contraste');
    if (botao) botao.setAttribute('aria-pressed', String(ativo));
  }

  function preferenciaSalva() {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo !== null) return salvo === 'alto';
    } catch (e) { /* storage bloqueado */ }
    return window.matchMedia('(prefers-contrast: more)').matches;
  }

  function iniciar() {
    botao = document.querySelector('[data-alternar-contraste]');
    aplicar(preferenciaSalva());
    if (!botao) return;
    botao.addEventListener('click', function () {
      const ativo = botao.getAttribute('aria-pressed') !== 'true';
      aplicar(ativo);
      try { localStorage.setItem(CHAVE, ativo ? 'alto' : 'normal'); } catch (e) { /* ignora */ }
      ONG.feedback.toast('info', ativo ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
      if (ONG.painel && document.getElementById('grafico-participacao')) ONG.painel.desenharGrafico();   // recolore o gráfico
    });
  }

  return { iniciar: iniciar };
})();
