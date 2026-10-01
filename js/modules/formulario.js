/* =========================================================
   Módulo: formulario
   Controla o cadastro: máscaras, validação com feedback em
   tempo real, rascunho automático e gravação no localStorage.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.formulario = (function () {
  let form, resumo, temporizadorRascunho;

  // Campos validados (as áreas de interesse são opcionais e livres)
  function camposValidaveis() {
    return Array.from(form.querySelectorAll('input, select, textarea'))
      .filter(function (c) { return c.name !== 'areas' && c.type !== 'hidden'; });
  }

  function idErro(campo) {
    return campo.type === 'radio' ? 'erro-' + campo.name : 'erro-' + campo.id;
  }

  // Valida um campo e atualiza o visual (aria-invalid) e a mensagem
  function validarCampo(campo) {
    const msg = ONG.validacao.mensagem(campo);
    campo.setCustomValidity(msg);

    const grupo = campo.type === 'radio' ? form.querySelectorAll('[name="' + campo.name + '"]') : [campo];
    const vazioOpcional = !campo.required && !campo.value && campo.type !== 'radio';
    grupo.forEach(function (c) {
      if (vazioOpcional) c.removeAttribute('aria-invalid');
      else c.setAttribute('aria-invalid', msg ? 'true' : 'false');
    });

    const erro = document.getElementById(idErro(campo));
    if (erro) erro.textContent = msg;
    return msg;
  }

  function aoSairDoCampo(e) {
    const campo = e.target;
    if (!campo.matches('input, select, textarea') || campo.name === 'areas') return;
    campo.dataset.tocado = 'sim';
    validarCampo(campo);
  }

  function aoDigitar(e) {
    const campo = e.target;
    if (campo.dataset.tocado === 'sim' || campo.type === 'radio' || campo.type === 'checkbox') {
      if (campo.name !== 'areas') validarCampo(campo);
    }
    if (campo.id === 'mensagem') atualizarContadorTexto();
    agendarRascunho();
  }

  function atualizarContadorTexto() {
    const msg = form.querySelector('#mensagem');
    const contador = form.querySelector('#contador-mensagem');
    if (msg && contador) contador.textContent = msg.value.length + ' de ' + msg.maxLength + ' caracteres';
  }

  /* ---------- Coleta e restauração dos dados ---------- */
  function coletarDados() {
    const dados = {};
    new FormData(form).forEach(function (valor, chave) {
      if (chave === 'areas') (dados.areas = dados.areas || []).push(valor);
      else if (chave !== 'termos') dados[chave] = String(valor).trim();
    });
    return dados;
  }

  function restaurarRascunho() {
    const rascunho = ONG.armazenamento.lerRascunho();
    if (!rascunho) return false;
    Object.keys(rascunho).forEach(function (chave) {
      const valor = rascunho[chave];
      if (chave === 'areas') {
        valor.forEach(function (v) { const c = form.querySelector('[name="areas"][value="' + v + '"]'); if (c) c.checked = true; });
      } else if (chave === 'participacao') {
        const r = form.querySelector('[name="participacao"][value="' + valor + '"]'); if (r) r.checked = true;
      } else if (form.elements[chave]) {
        form.elements[chave].value = valor;
      }
    });
    atualizarContadorTexto();
    return true;
  }

  function agendarRascunho() {
    clearTimeout(temporizadorRascunho);
    temporizadorRascunho = setTimeout(function () {
      ONG.armazenamento.salvarRascunho(coletarDados());
    }, 400);   // espera o usuário parar de digitar
  }

  function limparEstados() {
    camposValidaveis().forEach(function (c) {
      c.removeAttribute('aria-invalid');
      c.setCustomValidity('');
      delete c.dataset.tocado;
    });
    form.querySelectorAll('.campo-erro').forEach(function (p) { p.textContent = ''; });
    resumo.innerHTML = '';
    atualizarContadorTexto();
  }

  /* ---------- Resumo de erros no topo do formulário ---------- */
  function mostrarResumo(erros) {
    const itens = erros.map(function (e) {
      return '<li><button type="button" class="link-modal" data-focar="' + e.campo.id + '">' +
             ONG.templates.escapar(e.msg) + '</button></li>';
    }).join('');
    resumo.innerHTML = ONG.templates.alerta('erro',
      erros.length === 1 ? 'Corrija 1 campo para continuar' : 'Corrija ' + erros.length + ' campos para continuar',
      '<ul class="lista-erros">' + itens + '</ul>');
    resumo.querySelector('.alerta').setAttribute('tabindex', '-1');
    resumo.querySelector('.alerta').focus();
  }

  function aoEnviar(e) {
    e.preventDefault();
    const erros = [];
    const radiosVistos = {};
    camposValidaveis().forEach(function (c) {
      if (c.type === 'radio') { if (radiosVistos[c.name]) return; radiosVistos[c.name] = true; }
      c.dataset.tocado = 'sim';
      const msg = validarCampo(c);
      if (msg) erros.push({ campo: c, msg: msg });
    });

    if (erros.length) {
      mostrarResumo(erros);
      ONG.feedback.toast('erro', 'Há campos com erro. Confira as mensagens no formulário.');
      return;
    }

    const salvo = ONG.armazenamento.salvarCadastro(coletarDados());
    if (!salvo) {
      ONG.feedback.toast('erro', 'Não foi possível salvar o cadastro neste navegador.');
      return;
    }
    ONG.armazenamento.limparRascunho();
    form.reset();
    limparEstados();
    resumo.innerHTML = ONG.templates.alerta('sucesso', 'Cadastro enviado!',
      '<p>Obrigado, ' + ONG.templates.escapar(salvo.nome.split(' ')[0]) + '! Em breve entraremos em contato. <a href="#/painel">Ver cadastrados</a>.</p>');
    ONG.feedback.toast('sucesso', 'Cadastro salvo com sucesso!');
    ONG.menu.atualizarContador(ONG.armazenamento.listarCadastros().length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function aoClicar(e) {
    const focar = e.target.closest('[data-focar]');
    if (focar) {
      const campo = document.getElementById(focar.dataset.focar);
      if (campo) { campo.focus(); campo.scrollIntoView({ block: 'center' }); }
    }
    if (e.target.closest('[data-limpar-form]')) {
      form.reset();
      ONG.armazenamento.limparRascunho();
      limparEstados();
      ONG.feedback.toast('info', 'Formulário limpo.');
    }
  }

  // Chamado pelo roteador toda vez que a view de cadastro é montada
  function iniciar() {
    form = document.querySelector('#formulario form');
    resumo = document.querySelector('[data-resumo-erros]');
    if (!form) return;

    ONG.mascaras.aplicar(form);
    form.addEventListener('focusout', aoSairDoCampo);
    form.addEventListener('input', aoDigitar);
    form.addEventListener('change', aoDigitar);
    form.addEventListener('submit', aoEnviar);
    document.querySelector('#formulario').addEventListener('click', aoClicar);

    if (restaurarRascunho()) {
      ONG.feedback.toast('info', 'Recuperamos o preenchimento que você tinha começado.');
    }
  }

  return { iniciar: iniciar };
})();
