/* =========================================================
   Ponto de entrada da aplicação.
   Inicializa os módulos na ordem certa depois que o HTML carrega.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  ONG.acessibilidade.iniciar();   // modo de alto contraste (antes de desenhar)
  ONG.feedback.iniciar();   // toasts e modais (delegação de eventos)
  ONG.menu.iniciar();       // menu hambúrguer
  ONG.painel.iniciar();     // ações da lista de cadastrados
  ONG.menu.atualizarContador(ONG.armazenamento.listarCadastros().length);

  // Link "Pular para o conteúdo" sem alterar o hash (que é usado pelas rotas)
  const pular = document.querySelector('.pular-conteudo');
  if (pular) {
    pular.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('app').focus();
    });
  }

  ONG.roteador.iniciar();   // desenha a primeira "página"
});
