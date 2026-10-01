/* =========================================================
   Módulo: templates
   Funções que recebem dados e devolvem HTML (template literals).
   Componentes pequenos (badge, alerta, card) são reaproveitados
   pelas views maiores (início, projetos, cadastro, painel...).
   ========================================================= */
window.ONG = window.ONG || {};

ONG.templates = (function () {
  const IMG = '../imagens/';

  // Escapa texto vindo do usuário (localStorage) antes de inserir no HTML – evita XSS
  function escapar(texto) {
    return String(texto == null ? '' : texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- Componentes reutilizáveis ---------------- */

  function badge(tipo, texto) {
    return `<li class="badge badge--${tipo}">${escapar(texto)}</li>`;
  }

  function alerta(tipo, titulo, conteudoHTML) {
    const icones = { info: 'i', sucesso: '✓', aviso: '!', erro: '×' };
    const papel = tipo === 'erro' ? 'alert' : 'note';
    return `
      <div class="alerta alerta--${tipo}" role="${papel}">
        <span class="alerta__icone" aria-hidden="true">${icones[tipo]}</span>
        <div class="alerta__conteudo">
          <strong class="alerta__titulo">${escapar(titulo)}</strong>
          ${conteudoHTML}
        </div>
      </div>`;
  }

  function imagem(nome, alt, largura, altura, preguicosa) {
    return `
      <picture>
        <source srcset="${IMG}${nome}.webp" type="image/webp">
        <img src="${IMG}${nome}.jpg" alt="${escapar(alt)}" width="${largura}" height="${altura}"${preguicosa ? ' loading="lazy"' : ''}>
      </picture>`;
  }

  function cardProjeto(p) {
    return `
      <article class="card-projeto" id="projeto-${p.id}" data-categoria="${p.categoria.tipo}">
        <h3>${escapar(p.titulo)}</h3>
        <ul class="badges" aria-label="Categoria e situação">
          ${badge(p.categoria.tipo, p.categoria.nome)}
          ${badge(p.status.tipo, p.status.nome)}
        </ul>
        <figure>
          ${imagem(p.imagem, p.alt, 600, 400, true)}
          <figcaption>${escapar(p.legenda)}</figcaption>
        </figure>
        <p>${escapar(p.descricao)}</p>
      </article>`;
  }

  function cardValor(v) {
    const corpo = v.lista
      ? `<ul>${v.lista.map(function (item) { return `<li>${escapar(item)}</li>`; }).join('')}</ul>`
      : `<p>${escapar(v.texto)}</p>`;
    return `<article><h3>${escapar(v.titulo)}</h3>${corpo}</article>`;
  }

  /* ---------------- Views (páginas da SPA) ---------------- */

  function inicio(dados) {
    return `
      <section id="quem-somos">
        <h1>Bem-vindo ao Instituto Mãos Solidárias</h1>
        <h2>Quem somos</h2>
        <figure>
          ${imagem('equipe-voluntarios', 'Voluntários do Instituto Mãos Solidárias distribuindo cestas básicas em frente à sede da ONG', 800, 450, false)}
          <figcaption>Ação de distribuição de alimentos realizada em 2026.</figcaption>
        </figure>
        <p>O Instituto Mãos Solidárias é uma organização sem fins lucrativos que atua desde 2015
           no apoio a famílias em situação de vulnerabilidade social, com projetos de educação,
           alimentação e geração de renda.</p>
      </section>

      <section id="missao">
        <h2>Missão, visão e valores</h2>
        ${dados.valores.map(cardValor).join('')}
      </section>

      <section id="contato">
        <h2>Contato</h2>
        <address>
          <p><strong>Endereço:</strong> Rua das Flores, 123 – Centro – Caxias do Sul/RS – CEP 95010-000</p>
          <p><strong>Telefone:</strong> <a href="tel:+555432120000">(54) 3212-0000</a></p>
          <p><strong>E-mail:</strong> <a href="mailto:contato@maossolidarias.org.br">contato@maossolidarias.org.br</a></p>
          <p><strong>Horário de atendimento:</strong> segunda a sexta, das 8h às 18h</p>
        </address>
      </section>

      <aside aria-labelledby="titulo-ajude">
        <h2 id="titulo-ajude">Como você pode ajudar</h2>
        <p>Seja voluntário ou faça uma doação e ajude a transformar vidas.</p>
        <p><a class="botao" href="#/cadastro">Quero ser voluntário ou doador</a></p>
      </aside>`;
  }

  function projetos(dados) {
    return `
      <section id="introducao">
        <h1>Projetos Sociais</h1>
        <h2>Nossas frentes de atuação</h2>
        <p>Atuamos em três frentes: educação, segurança alimentar e geração de renda. Use os filtros
           para encontrar o projeto que combina com você.</p>
        <div class="filtros" role="group" aria-label="Filtrar projetos por categoria">
          <button type="button" class="filtro" data-filtro="todos" aria-pressed="true">Todos</button>
          ${dados.projetos.map(function (p) {
            return `<button type="button" class="filtro" data-filtro="${p.categoria.tipo}" aria-pressed="false">${escapar(p.categoria.nome)}</button>`;
          }).join('')}
        </div>
      </section>

      <section id="projetos">
        <h2>Nossos projetos</h2>
        ${dados.projetos.map(cardProjeto).join('')}
      </section>

      <section id="voluntariado">
        <h2>Seja voluntário</h2>
        <p>Veja como participar:</p>
        <ol>${dados.etapasVoluntariado.map(function (e) { return `<li>${escapar(e)}</li>`; }).join('')}</ol>
        <p>Áreas de atuação:</p>
        <ul>${dados.areasAtuacao.map(function (a) { return `<li>${escapar(a.nome)}</li>`; }).join('')}</ul>
        <p><a class="botao" href="#/cadastro">Quero ser voluntário</a></p>
      </section>

      <section id="doacoes">
        <h2>Faça uma doação</h2>
        <article>
          <h3>Doação financeira</h3>
          <ul>
            <li>PIX: contato@maossolidarias.org.br</li>
            <li>Doação mensal ou única, de qualquer valor</li>
          </ul>
          <p><a class="botao" href="#/cadastro">Quero doar</a></p>
        </article>
        <article>
          <h3>Doação de itens</h3>
          <ul>
            <li>Alimentos não perecíveis, roupas e material escolar</li>
            <li>Entrega na sede, de segunda a sexta, das 8h às 18h</li>
          </ul>
          <p><a class="botao" href="#/cadastro">Quero doar itens</a></p>
        </article>
      </section>

      <aside aria-labelledby="titulo-transparencia">
        <h2 id="titulo-transparencia">Transparência</h2>
        <p>Publicamos anualmente a prestação de contas, com o destino de todos os recursos arrecadados.</p>
      </aside>`;
  }

  function campoTexto(id, rotulo, atributos, obrigatorio) {
    return `
      <label for="${id}">${rotulo}${obrigatorio ? ' *' : ''}</label>
      <input id="${id}" name="${id}" ${atributos}${obrigatorio ? ' required' : ''} aria-describedby="erro-${id}">
      <p class="campo-erro" id="erro-${id}"></p>`;
  }

  function cadastro(dados) {
    return `
      <section id="formulario">
        <h1>Cadastro de Voluntários e Doadores</h1>
        ${alerta('info', 'Seus dados estão protegidos',
          '<p>Usamos suas informações apenas para contato sobre voluntariado e doações, conforme a LGPD. O preenchimento é salvo automaticamente neste navegador. Campos marcados com * são obrigatórios.</p>')}
        <div data-resumo-erros></div>

        <form action="#" method="post" novalidate>
          <fieldset>
            <legend>Dados pessoais</legend>
            ${campoTexto('nome', 'Nome completo', 'type="text" minlength="3" maxlength="100" autocomplete="name"', true)}
            ${campoTexto('cpf', 'CPF', 'type="text" inputmode="numeric" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" maxlength="14" placeholder="000.000.000-00" data-mascara="cpf"', true)}
            ${campoTexto('nascimento', 'Data de nascimento', 'type="date" min="1920-01-01" max="2010-12-31"', true)}
          </fieldset>

          <fieldset>
            <legend>Contato</legend>
            ${campoTexto('email', 'E-mail', 'type="email" autocomplete="email"', true)}
            ${campoTexto('telefone', 'Telefone', 'type="tel" pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}" maxlength="15" placeholder="(00) 00000-0000" autocomplete="tel" data-mascara="telefone"', true)}
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>
            ${campoTexto('cep', 'CEP', 'type="text" inputmode="numeric" pattern="\\d{5}-\\d{3}" maxlength="9" placeholder="00000-000" autocomplete="postal-code" data-mascara="cep"', true)}
            ${campoTexto('logradouro', 'Endereço', 'type="text" autocomplete="address-line1"', true)}
            ${campoTexto('numero', 'Número', 'type="text" maxlength="10"', true)}
            ${campoTexto('complemento', 'Complemento', 'type="text" autocomplete="address-line2"', false)}
            ${campoTexto('bairro', 'Bairro', 'type="text"', true)}
            ${campoTexto('cidade', 'Cidade', 'type="text" autocomplete="address-level2"', true)}
            <label for="estado">Estado *</label>
            <select id="estado" name="estado" autocomplete="address-level1" required aria-describedby="erro-estado">
              <option value="">Selecione</option>
              ${dados.estados.map(function (uf) { return `<option value="${uf}">${uf}</option>`; }).join('')}
            </select>
            <p class="campo-erro" id="erro-estado"></p>
          </fieldset>

          <fieldset aria-describedby="erro-participacao">
            <legend>Forma de participação *</legend>
            <div class="grupo-opcoes">
              ${Object.keys(dados.participacoes).map(function (valor, i) {
                return `<div class="opcao"><input type="radio" id="part-${valor}" name="participacao" value="${valor}"${i === 0 ? ' required' : ''}> <label for="part-${valor}">${dados.participacoes[valor]}</label></div>`;
              }).join('')}
            </div>
            <p class="campo-erro" id="erro-participacao"></p>
          </fieldset>

          <fieldset>
            <legend>Áreas de interesse</legend>
            <div class="grupo-opcoes">
              ${dados.areasAtuacao.map(function (a) {
                return `<div class="opcao"><input type="checkbox" id="area-${a.valor}" name="areas" value="${a.valor}"> <label for="area-${a.valor}">${a.nome}</label></div>`;
              }).join('')}
            </div>
            <label for="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows="4" maxlength="500" aria-describedby="contador-mensagem"></textarea>
            <p class="contador-texto" id="contador-mensagem">0 de 500 caracteres</p>
          </fieldset>

          <div class="aceite">
            <input type="checkbox" id="termos" name="termos" required aria-describedby="erro-termos">
            <label for="termos">Li e aceito os termos de uso e a política de privacidade *</label>
            <button type="button" class="link-modal" data-abrir-modal="modal-termos">Ler os termos</button>
          </div>
          <p class="campo-erro" id="erro-termos"></p>

          <div class="acoes-form">
            <button type="submit" class="botao" id="enviar">Enviar cadastro</button>
            <button type="button" class="botao botao--secundario" data-limpar-form>Limpar formulário</button>
          </div>
        </form>
      </section>

      <dialog class="modal" id="modal-termos" aria-labelledby="titulo-termos">
        <div class="modal__cabecalho">
          <h2 class="modal__titulo" id="titulo-termos">Termos de uso e privacidade</h2>
          <button type="button" class="modal__fechar" data-fechar-modal aria-label="Fechar">×</button>
        </div>
        <div class="modal__corpo">
          <p>Ao se cadastrar, você autoriza o Instituto Mãos Solidárias a armazenar seus dados para contato
             sobre ações de voluntariado e campanhas de doação.</p>
          <p>Seus dados não são vendidos nem compartilhados com terceiros. Você pode solicitar a exclusão a
             qualquer momento pelo e-mail contato@maossolidarias.org.br, conforme a LGPD.</p>
        </div>
        <div class="modal__rodape">
          <button type="button" class="botao" data-fechar-modal>Entendi</button>
        </div>
      </dialog>`;
  }

  function linhaCadastro(c, dados) {
    const data = new Date(c.criadoEm).toLocaleDateString('pt-BR');
    return `
      <tr>
        <td data-rotulo="Nome">${escapar(c.nome)}</td>
        <td data-rotulo="E-mail">${escapar(c.email)}</td>
        <td data-rotulo="Participação"><span class="badge badge--info">${escapar(dados.participacoes[c.participacao] || c.participacao)}</span></td>
        <td data-rotulo="Cidade">${escapar(c.cidade)}/${escapar(c.estado)}</td>
        <td data-rotulo="Data">${data}</td>
        <td data-rotulo="Ações"><button type="button" class="botao botao--perigo botao--pequeno" data-remover="${escapar(c.id)}" aria-label="Remover cadastro de ${escapar(c.nome)}">Remover</button></td>
      </tr>`;
  }

  function painel(cadastros, dados) {
    const conteudo = cadastros.length === 0
      ? alerta('info', 'Nenhum cadastro ainda', '<p>Os cadastros enviados pelo formulário aparecem aqui. <a href="#/cadastro">Fazer o primeiro cadastro</a>.</p>')
      : `
        <div class="painel__barra">
          <p><strong>${cadastros.length}</strong> ${cadastros.length === 1 ? 'cadastro salvo' : 'cadastros salvos'} neste navegador.</p>
          <button type="button" class="botao botao--secundario" data-abrir-modal="modal-limpar">Remover todos</button>
        </div>
        <div class="tabela-rolagem">
          <table class="tabela">
            <caption class="sr-only">Lista de voluntários e doadores cadastrados</caption>
            <thead><tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Participação</th><th scope="col">Cidade</th><th scope="col">Data</th><th scope="col">Ações</th></tr></thead>
            <tbody>${cadastros.map(function (c) { return linhaCadastro(c, dados); }).join('')}</tbody>
          </table>
        </div>`;

    return `
      <section id="painel">
        <h1>Voluntários e doadores cadastrados</h1>
        ${alerta('aviso', 'Dados de demonstração', '<p>Esta lista é lida do <code>localStorage</code> e fica apenas neste navegador. Em produção, os dados viriam do servidor.</p>')}
        <div data-lista-cadastros>${conteudo}</div>
      </section>

      <dialog class="modal" id="modal-limpar" aria-labelledby="titulo-limpar">
        <div class="modal__cabecalho">
          <h2 class="modal__titulo" id="titulo-limpar">Remover todos os cadastros?</h2>
          <button type="button" class="modal__fechar" data-fechar-modal aria-label="Fechar">×</button>
        </div>
        <div class="modal__corpo"><p>Esta ação apaga todos os cadastros salvos neste navegador e não pode ser desfeita.</p></div>
        <div class="modal__rodape">
          <button type="button" class="botao botao--secundario" data-fechar-modal>Cancelar</button>
          <button type="button" class="botao botao--perigo" data-fechar-modal data-limpar-todos>Remover todos</button>
        </div>
      </dialog>`;
  }

  function componentes() {
    return `
      <section id="guia-badges">
        <h1>Guia de Componentes</h1>
        <h2>Badges</h2>
        <ul class="badges vitrine" aria-label="Exemplos de badges">
          ${badge('educacao', 'Educação')}${badge('alimentacao', 'Alimentação')}${badge('renda', 'Geração de renda')}
          ${badge('sucesso', 'Ativo')}${badge('aviso', 'Precisa de voluntários')}${badge('erro', 'Encerrado')}
        </ul>
      </section>
      <section id="guia-alertas">
        <h2>Alertas</h2>
        ${alerta('info', 'Informação', '<p>As inscrições para o mutirão de outubro abrem na próxima segunda-feira.</p>')}
        ${alerta('sucesso', 'Sucesso', '<p>Sua doação foi registrada. Obrigado por apoiar nossos projetos!</p>')}
        ${alerta('aviso', 'Atenção', '<p>A Cozinha Solidária está com poucas vagas de voluntariado para o turno da noite.</p>')}
        ${alerta('erro', 'Erro', '<p>Não foi possível enviar o cadastro. Verifique sua conexão e tente novamente.</p>')}
      </section>
      <section id="guia-toasts">
        <h2>Toasts</h2>
        <div class="vitrine">
          <button type="button" class="botao" data-toast="sucesso" data-mensagem="Cadastro enviado com sucesso!">Toast de sucesso</button>
          <button type="button" class="botao" data-toast="info" data-mensagem="Novo projeto disponível para voluntários.">Toast informativo</button>
          <button type="button" class="botao" data-toast="aviso" data-mensagem="Sua sessão expira em 5 minutos.">Toast de aviso</button>
          <button type="button" class="botao" data-toast="erro" data-mensagem="Falha ao enviar. Tente novamente.">Toast de erro</button>
        </div>
      </section>`;
  }

  function naoEncontrado(rota) {
    return `
      <section id="nao-encontrado">
        <h1>Página não encontrada</h1>
        ${alerta('aviso', 'Endereço inválido', `<p>A página <code>${escapar(rota)}</code> não existe. <a href="#/inicio">Voltar ao início</a>.</p>`)}
      </section>`;
  }

  return {
    escapar: escapar,
    badge: badge,
    alerta: alerta,
    cardProjeto: cardProjeto,
    inicio: inicio,
    projetos: projetos,
    cadastro: cadastro,
    painel: painel,
    componentes: componentes,
    naoEncontrado: naoEncontrado
  };
})();
