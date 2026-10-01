/* =========================================================
   Módulo: armazenamento
   Camada única de acesso ao localStorage. O resto do código
   nunca chama localStorage diretamente.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.armazenamento = (function () {
  const PREFIXO = 'maos-solidarias:';
  const CHAVES = { cadastros: 'cadastros', rascunho: 'rascunho-cadastro' };

  // Leitura segura: se o navegador bloquear o storage ou o JSON estiver corrompido, devolve o padrão
  function ler(chave, padrao) {
    try {
      const valor = localStorage.getItem(PREFIXO + chave);
      return valor === null ? padrao : JSON.parse(valor);
    } catch (erro) {
      console.warn('[armazenamento] falha ao ler', chave, erro);
      return padrao;
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.warn('[armazenamento] falha ao gravar', chave, erro);
      return false;
    }
  }

  function remover(chave) {
    try { localStorage.removeItem(PREFIXO + chave); } catch (erro) { /* ignora */ }
  }

  // ---------- Cadastros de voluntários e doadores ----------
  function listarCadastros() {
    return ler(CHAVES.cadastros, []);
  }

  function salvarCadastro(dados) {
    const cadastros = listarCadastros();
    const novo = Object.assign({}, dados, {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      criadoEm: new Date().toISOString()
    });
    cadastros.push(novo);
    return gravar(CHAVES.cadastros, cadastros) ? novo : null;
  }

  function removerCadastro(id) {
    const restantes = listarCadastros().filter(function (c) { return c.id !== id; });
    gravar(CHAVES.cadastros, restantes);
    return restantes;
  }

  function limparCadastros() { remover(CHAVES.cadastros); }

  // ---------- Rascunho do formulário (preenchimento salvo automaticamente) ----------
  function salvarRascunho(dados) { gravar(CHAVES.rascunho, dados); }
  function lerRascunho() { return ler(CHAVES.rascunho, null); }
  function limparRascunho() { remover(CHAVES.rascunho); }

  return {
    listarCadastros: listarCadastros,
    salvarCadastro: salvarCadastro,
    removerCadastro: removerCadastro,
    limparCadastros: limparCadastros,
    salvarRascunho: salvarRascunho,
    lerRascunho: lerRascunho,
    limparRascunho: limparRascunho
  };
})();
