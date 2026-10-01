/* =========================================================
   Módulo: roteador
   Navegação de página única (SPA) baseada no hash da URL:
   #/inicio, #/projetos, #/cadastro, #/painel, #/componentes.
   Troca apenas o conteúdo do <main id="app">, sem recarregar.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.roteador = (function () {
  const SITE = 'Instituto Mãos Solidárias';
  let app, primeiraCarga = true;

  const rotas = {
    '/inicio':      { titulo: 'Início',      view: function () { return ONG.templates.inicio(ONG.dados); } },
    '/projetos':    { titulo: 'Projetos',    view: function () { return ONG.templates.projetos(ONG.dados); }, aoMontar: iniciarFiltros },
    '/cadastro':    { titulo: 'Cadastro',    view: function () { return ONG.templates.cadastro(ONG.dados); }, aoMontar: function () { ONG.formulario.iniciar(); } },
    '/painel':      { titulo: 'Cadastrados', view: function () { return ONG.templates.painel(ONG.armazenamento.listarCadastros(), ONG.dados); } },
    '/componentes': { titulo: 'Guia de componentes', view: function () { return ONG.templates.componentes(); } }
  };

  // "#/projetos?secao=doacoes" → { caminho: '/projetos', params: { secao: 'doacoes' } }
  function lerHash() {
    const hash = location.hash.slice(1) || '/inicio';
    const partes = hash.split('?');
    const params = {};
    new URLSearchParams(partes[1] || '').forEach(function (v, k) { params[k] = v; });
    return { caminho: partes[0], params: params };
  }

  // Filtro de projetos por categoria (exibe/oculta cards)
  function iniciarFiltros() {
    const botoes = app.querySelectorAll('[data-filtro]');
    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        const filtro = botao.dataset.filtro;
        botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b === botao)); });
        app.querySelectorAll('.card-projeto').forEach(function (card) {
          card.hidden = filtro !== 'todos' && card.dataset.categoria !== filtro;
        });
      });
    });
  }

  function renderizar() {
    if (location.hash && !location.hash.startsWith('#/')) return;   // âncoras comuns não são rotas

    const atual = lerHash();
    const rota = rotas[atual.caminho];

    app.innerHTML = rota ? rota.view() : ONG.templates.naoEncontrado(atual.caminho);
    document.title = (rota ? rota.titulo : 'Página não encontrada') + ' | ' + SITE;
    ONG.menu.marcarAtivo(atual.caminho);
    ONG.menu.fechar();
    if (rota && rota.aoMontar) rota.aoMontar(atual.params);

    // Acessibilidade: anuncia a troca de página e move o foco para o título
    const anuncio = document.getElementById('anuncio-rota');
    if (anuncio) anuncio.textContent = 'Página ' + (rota ? rota.titulo : 'não encontrada') + ' carregada';

    const alvo = atual.params.secao && document.getElementById(atual.params.secao);
    if (alvo) {
      alvo.scrollIntoView({ behavior: primeiraCarga ? 'auto' : 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
    if (!primeiraCarga) {
      const titulo = app.querySelector('h1');
      if (titulo) { titulo.setAttribute('tabindex', '-1'); titulo.focus({ preventScroll: true }); }
    }
    primeiraCarga = false;
  }

  function iniciar() {
    app = document.getElementById('app');
    window.addEventListener('hashchange', renderizar);
    renderizar();
  }

  return { iniciar: iniciar };
})();
