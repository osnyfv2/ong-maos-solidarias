/* =========================================================
   Módulo: painel
   Lista os cadastros salvos no localStorage e permite removê-los.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.painel = (function () {
  function renderizarLista() {
    const area = document.querySelector('[data-lista-cadastros]');
    if (!area) return;
    const cadastros = ONG.armazenamento.listarCadastros();
    // Reaproveita o template do painel e extrai só a parte da lista
    const temp = document.createElement('div');
    temp.innerHTML = ONG.templates.painel(cadastros, ONG.dados);
    area.innerHTML = temp.querySelector('[data-lista-cadastros]').innerHTML;
    ONG.menu.atualizarContador(cadastros.length);
  }

  function iniciar() {
    // Delegação: um único listener atende a todos os botões, mesmo os criados depois
    document.addEventListener('click', function (e) {
      const remover = e.target.closest('[data-remover]');
      if (remover) {
        ONG.armazenamento.removerCadastro(remover.dataset.remover);
        renderizarLista();
        ONG.feedback.toast('info', 'Cadastro removido.');
      }
      if (e.target.closest('[data-limpar-todos]')) {
        ONG.armazenamento.limparCadastros();
        renderizarLista();
        ONG.feedback.toast('info', 'Todos os cadastros foram removidos.');
      }
    });
  }

  return { iniciar: iniciar };
})();
