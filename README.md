# Instituto Mãos Solidárias – Plataforma Web

Plataforma web de uma ONG fictícia de Caxias do Sul/RS, criada na disciplina **Desenvolvimento Front-end para Web**. O site apresenta a organização e seus projetos sociais e permite o cadastro de voluntários e doadores.

É uma **Single Page Application (SPA)** feita com HTML5 semântico, CSS3 e JavaScript puro, sem frameworks de interface.

---

## Funcionalidades

- **Navegação SPA** por hash (`#/inicio`, `#/projetos`, `#/cadastro`, `#/painel`), sem recarregar a página.
- **Templates em JavaScript**: páginas e componentes (cards, badges, alertas) gerados a partir de dados.
- **Filtro de projetos** por categoria.
- **Cadastro com validação em tempo real**:
  - máscaras de CPF, telefone e CEP;
  - cálculo dos dígitos verificadores do CPF;
  - idade mínima de 16 anos;
  - mensagens de erro acessíveis.
- **Persistência com `localStorage`**: os cadastros ficam salvos e o rascunho do formulário é recuperado automaticamente.
- **Painel de cadastrados** com tabela, remoção de registros e gráfico (Chart.js).
- **Componentes de feedback**: toasts, modais (`<dialog>`), alertas e badges.
- **Layout responsivo**: grid de 12 colunas, 5 breakpoints e menu hambúrguer com dropdown.
- **Acessibilidade**: semântica, navegação por teclado, foco visível, ARIA e contraste WCAG AA.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Comportamento | JavaScript ES6+ (módulos IIFE, DOM, eventos, `localStorage`) |
| Biblioteca | [Chart.js 4.5.1](https://www.chartjs.org/) (incluída em `js/vendor/`) |
| Build | esbuild + html-minifier-terser (Node.js) |
| Deploy | GitHub Actions + GitHub Pages |
| Versionamento | Git + GitHub (GitFlow) |

## Estrutura de pastas

```
├── index.html              # redireciona para html/index.html
├── build.mjs               # script de build de produção (gera dist/)
├── package.json            # dependências de desenvolvimento e scripts npm
├── .github/workflows/      # deploy automático no GitHub Pages
├── html/
│   └── index.html          # "casca" da SPA (cabeçalho, menu, <main id="app">, rodapé)
├── css/
│   ├── variaveis.css       # design system: cores, tipografia, espaçamentos, grid
│   ├── base.css            # reset, tipografia e utilitários de acessibilidade
│   ├── layout.css          # grid de 12 colunas e breakpoints
│   └── componentes.css     # menu, cards, botões, formulários, alertas, modais, tabela
├── imagens/                # imagens em JPG/PNG + WebP
└── js/
    ├── main.js             # ponto de entrada: inicializa os módulos
    ├── vendor/
    │   └── chart.umd.min.js
    └── modules/
        ├── armazenamento.js  # único acesso ao localStorage
        ├── dados.js          # conteúdo da ONG (projetos, valores, estados)
        ├── templates.js      # funções que geram o HTML das páginas e componentes
        ├── roteador.js       # navegação da SPA
        ├── formulario.js     # controle do cadastro (eventos, rascunho, envio)
        ├── validacao.js      # regras de validação
        ├── mascaras.js       # máscaras de CPF, telefone e CEP
        ├── feedback.js       # toasts e modais
        ├── menu.js           # menu hambúrguer e link ativo
        └── painel.js         # lista de cadastrados e gráfico
```

## Como executar

Não precisa instalar nada.

**Opção 1: abrir direto no navegador**
1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/osnyfv2/ong-maos-solidarias.git
   ```
2. Abra o arquivo `index.html` (ou `html/index.html`) no navegador.

**Opção 2: servidor local (recomendado)**
- No VS Code, instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha *Open with Live Server*.

**Opção 3: online**
- https://osnyfv2.github.io/ong-maos-solidarias/

## Build de produção

O código-fonte fica legível em `html/`, `css/` e `js/`. Para publicar, um build gera a pasta `dist/` minificada.

**Pré-requisito:** [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install        # instala esbuild e html-minifier-terser
npm run build      # gera dist/ (CSS, JS e HTML minificados)
npm run preview    # serve a pasta dist/ localmente para teste
```

O que o build faz (`build.mjs`):
- **CSS:** une `variaveis`, `base`, `layout` e `componentes` em `css/estilo.min.css` e minifica com esbuild.
- **JS:** une os 12 módulos na ordem de dependência em `js/app.min.js` e minifica com esbuild.
- **HTML:** troca os vários `<link>` e `<script>` pelos arquivos gerados e minifica com html-minifier-terser.
- **Imagens:** são copiadas. As fotos estão em WebP (cerca de 60% menores que os JPG/PNG), com JPG/PNG como alternativa via `<picture>`, e as dos cards usam `loading="lazy"`.

Resultado: cerca de 32% menos bytes em CSS, JS e HTML, e 16 requisições de CSS/JS próprios reduzidas a 2.

## Deploy

O deploy é automático pelo **GitHub Actions** (`.github/workflows/deploy.yml`): a cada push na `main`, o workflow roda `npm ci`, `npm run build` e publica a pasta `dist/` no GitHub Pages.

Configuração (uma única vez): **Settings → Pages → Source: GitHub Actions**.

Site publicado: https://osnyfv2.github.io/ong-maos-solidarias/

## Testes

- **Acessibilidade:** Lighthouse (100) e axe-core (0 violações WCAG 2.1 AA) em todas as páginas, com e sem alto contraste.
- **Validação:** W3C Nu HTML Checker sem erros no HTML e no CSS.
- **Funcionais:** navegação SPA, filtro, validação do formulário, rascunho, gravação e remoção no `localStorage`, testados no navegador.

## Como usar

1. **Início**: apresentação da ONG, missão e contato.
2. **Projetos**: projetos com filtro por categoria e informações de voluntariado e doação.
3. **Cadastro**: preencha o formulário. Os erros aparecem ao sair de cada campo e no envio. O preenchimento é salvo como rascunho.
4. **Cadastrados**: lista e gráfico dos cadastros salvos no navegador, com opção de remover.

> Os dados ficam apenas no `localStorage` do navegador. Para apagá-los, use "Remover todos" no painel ou limpe os dados do site.

## Manutenção

| Tarefa | Onde mexer |
|---|---|
| Adicionar ou editar um projeto | `js/modules/dados.js` (array `projetos`) |
| Criar uma nova página | template em `templates.js` + rota em `roteador.js` + link no menu (`html/index.html`) |
| Mudar cores, fontes ou espaçamentos | `css/variaveis.css` |
| Alterar regras de validação | `js/modules/validacao.js` |
| Trocar o `localStorage` por uma API | somente `js/modules/armazenamento.js` |

## Fluxo de trabalho (GitFlow)

| Branch | Uso |
|---|---|
| `main` | versão estável publicada (cada release recebe uma tag `vX.Y.Z`) |
| `develop` | integração do desenvolvimento |
| `feature/*` | novas funcionalidades, criadas a partir de `develop` |
| `release/*` | preparação de uma versão, mesclada em `main` e `develop` |
| `hotfix/*` | correção urgente, criada a partir de `main` e mesclada em `main` e `develop` |

Os merges usam `--no-ff` para preservar o histórico de cada branch.

### Padrão de commits (Conventional Commits)

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    ajustes visuais/CSS sem mudar comportamento
refactor: reorganização de código
chore:    configuração e tarefas de manutenção
```

Exemplo: `feat(cadastro): valida dígitos verificadores do CPF`

## Acessibilidade (WCAG 2.1 AA)

- Estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) e um `h1` por página.
- Navegação completa por teclado, link "Pular para o conteúdo" e foco visível.
- Labels associados, `aria-invalid` e `aria-describedby` nas mensagens de erro.
- Contraste mínimo de 4,5:1 e estados que não dependem só de cor (ícones e texto).
- Respeito a `prefers-reduced-motion`.

## Autor

**Osny**, estudante de Desenvolvimento Front-end para Web.

## Licença

Projeto acadêmico, de uso educacional.
