/* =========================================================
   Módulo: feedback
   Toasts (notificações temporárias) e modais (<dialog>).
   Usa delegação de eventos no document, então funciona
   mesmo com o conteúdo trocado dinamicamente pelo roteador.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.feedback = (function () {
  function toast(tipo, mensagem, duracao) {
    const area = document.querySelector('.toast-area');
    if (!area) return;

    const el = document.createElement('div');
    el.className = 'toast toast--' + tipo;
    el.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');

    const texto = document.createElement('p');
    texto.className = 'toast__texto';
    texto.textContent = mensagem;          // textContent: nunca interpreta HTML

    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'toast__fechar';
    fechar.setAttribute('aria-label', 'Fechar notificação');
    fechar.textContent = '×';

    el.append(texto, fechar);
    area.appendChild(el);

    let removido = false;
    function remover() {
      if (removido) return;
      removido = true;
      el.classList.add('toast--saindo');
      setTimeout(function () { el.remove(); }, 300);
    }
    fechar.addEventListener('click', remover);
    setTimeout(remover, duracao || 5000);
  }

  function iniciar() {
    document.addEventListener('click', function (e) {
      const abrir = e.target.closest('[data-abrir-modal]');
      if (abrir) {
        const modal = document.getElementById(abrir.dataset.abrirModal);
        if (modal) modal.showModal();       // prende o foco e fecha com Esc
      }
      const fechar = e.target.closest('[data-fechar-modal]');
      if (fechar) fechar.closest('dialog').close();

      if (e.target.matches('dialog.modal')) e.target.close();   // clique no fundo escuro

      const demo = e.target.closest('[data-toast]');
      if (demo) toast(demo.dataset.toast, demo.dataset.mensagem);
    });
  }

  return { toast: toast, iniciar: iniciar };
})();
