/* =========================================================
   Build de produção
   Gera a pasta dist/ pronta para publicar:
   - CSS: os 4 arquivos viram 1 só, minificado (esbuild)
   - JS:  os módulos são unidos na ordem de dependência e minificados (esbuild)
   - HTML: minificado (html-minifier-terser), com os caminhos ajustados
   - Imagens e Chart.js: copiados sem alteração
   Uso: npm run build
   ========================================================= */
import { build, transform } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { readFile, writeFile, mkdir, cp, rm, stat, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';

// Ordem de carregamento (a mesma do html/index.html)
const MODULOS = [
  'armazenamento', 'dados', 'templates', 'mascaras', 'validacao',
  'feedback', 'menu', 'acessibilidade', 'formulario', 'painel', 'roteador'
].map((m) => `js/modules/${m}.js`).concat('js/main.js');

const CSS = ['variaveis', 'base', 'layout', 'componentes'].map((c) => `css/${c}.css`);

async function tamanho(arquivos) {
  let total = 0;
  for (const a of arquivos) total += (await stat(a)).size;
  return total;
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(`${DIST}/css`, { recursive: true });
  await mkdir(`${DIST}/js/vendor`, { recursive: true });

  // ---------- CSS: concatena e minifica ----------
  const cssFonte = (await Promise.all(CSS.map((f) => readFile(f, 'utf8')))).join('\n');
  const css = await transform(cssFonte, { loader: 'css', minify: true, target: ['chrome100', 'firefox100', 'safari15'] });
  await writeFile(`${DIST}/css/estilo.min.css`, css.code);

  // ---------- JS: concatena na ordem e minifica ----------
  let jsFonte = (await Promise.all(MODULOS.map((f) => readFile(f, 'utf8')))).join('\n;\n');
  jsFonte = jsFonte.replaceAll("'../imagens/'", "'imagens/'");          // em dist/ o HTML fica na raiz
  const js = await transform(jsFonte, { loader: 'js', minify: true, target: 'es2018' });
  await writeFile(`${DIST}/js/app.min.js`, js.code);

  // ---------- HTML: troca os vários <link>/<script> pelos arquivos gerados e minifica ----------
  let html = await readFile('html/index.html', 'utf8');
  html = html
    .replace(/\s*<!--[^]*?-->/g, '')                                      // comentários
    .replace(/\s*<link rel="stylesheet" href="\.\.\/css\/[^"]+">/g, '')
    .replace(/\s*<script src="\.\.\/js\/(modules\/[^"]+|main\.js)" defer><\/script>/g, '')
    .replace('<script src="../js/vendor/chart.umd.min.js" defer></script>',
      '<link rel="stylesheet" href="css/estilo.min.css">\n' +
      '<script src="js/vendor/chart.umd.min.js" defer></script>\n' +
      '<script src="js/app.min.js" defer></script>')
    .replaceAll('../imagens/', 'imagens/');
  const htmlMin = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });
  await writeFile(`${DIST}/index.html`, htmlMin);

  // ---------- Arquivos estáticos ----------
  await cp('imagens', `${DIST}/imagens`, { recursive: true });
  await cp('js/vendor/chart.umd.min.js', `${DIST}/js/vendor/chart.umd.min.js`);
  await writeFile(`${DIST}/.nojekyll`, '');                               // GitHub Pages serve os arquivos como estão

  // ---------- Relatório ----------
  const antes = { css: await tamanho(CSS), js: await tamanho(MODULOS), html: await tamanho(['html/index.html']) };
  const depois = {
    css: await tamanho([`${DIST}/css/estilo.min.css`]),
    js: await tamanho([`${DIST}/js/app.min.js`]),
    html: await tamanho([`${DIST}/index.html`])
  };
  const kb = (b) => (b / 1024).toFixed(1) + ' KB';
  console.log('\nArquivo   Antes      Depois     Redução');
  for (const k of ['css', 'js', 'html']) {
    const reducao = Math.round((1 - depois[k] / antes[k]) * 100);
    console.log(`${k.padEnd(8)}  ${kb(antes[k]).padEnd(9)}  ${kb(depois[k]).padEnd(9)}  ${reducao}%`);
  }
  const totA = antes.css + antes.js + antes.html, totD = depois.css + depois.js + depois.html;
  console.log(`total     ${kb(totA).padEnd(9)}  ${kb(totD).padEnd(9)}  ${Math.round((1 - totD / totA) * 100)}%`);
  console.log(`Requisições de CSS/JS próprios: ${CSS.length + MODULOS.length} → 2\n`);
}

main().catch((erro) => { console.error(erro); process.exit(1); });
