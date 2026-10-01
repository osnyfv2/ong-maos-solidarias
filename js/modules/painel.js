/* =========================================================
   Módulo: painel
   Lista os cadastros salvos no localStorage e permite removê-los.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.painel = (function () {
  let grafico = null;   // instância atual do Chart.js

  // Gráfico de barras com o total por forma de participação (biblioteca Chart.js)
  function desenharGrafico() {
    const canvas = document.getElementById('grafico-participacao');
    if (grafico) { grafico.destroy(); grafico = null; }   // evita gráficos sobrepostos
    if (!canvas || typeof window.Chart === 'undefined') return;   // sem a biblioteca, a tabela continua funcionando

    const cadastros = ONG.armazenamento.listarCadastros();
    const tipos = Object.keys(ONG.dados.participacoes);
    const totais = tipos.map(function (t) {
      return cadastros.filter(function (c) { return c.participacao === t; }).length;
    });
    const css = getComputedStyle(document.documentElement);
    const cor = function (nome) { return css.getPropertyValue(nome).trim(); };

    grafico = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: tipos.map(function (t) { return ONG.dados.participacoes[t]; }),
        datasets: [{
          label: 'Cadastros',
          data: totais,
          backgroundColor: [cor('--cor-primaria'), cor('--cor-secundaria'), cor('--cor-aviso')],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 600 },
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
  function renderizarLista() {
    const area = document.querySelector('[data-lista-cadastros]');
    if (!area) return;
    const cadastros = ONG.armazenamento.listarCadastros();
    // Reaproveita o template do painel e extrai só a parte da lista
    const temp = document.createElement('div');
    temp.innerHTML = ONG.templates.painel(cadastros, ONG.dados);
    area.innerHTML = temp.querySelector('[data-lista-cadastros]').innerHTML;
    ONG.menu.atualizarContador(cadastros.length);
    desenharGrafico();
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

  return { iniciar: iniciar, desenharGrafico: desenharGrafico };
})();
