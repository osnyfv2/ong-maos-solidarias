/* =========================================================
   Módulo: dados
   Conteúdo da ONG separado da apresentação. Em um sistema real,
   estes dados viriam de uma API; aqui ficam em objetos JS.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.dados = {
  projetos: [
    {
      id: 'educacao',
      titulo: 'Educação para Todos',
      categoria: { tipo: 'educacao', nome: 'Educação' },
      status: { tipo: 'sucesso', nome: 'Ativo' },
      imagem: 'projeto-educacao',
      alt: 'Sala de aula do projeto com mesas e materiais escolares prontos para o reforço escolar',
      legenda: 'Reforço escolar no contraturno.',
      descricao: 'Aulas de reforço escolar e oficinas de leitura para crianças de 6 a 14 anos.'
    },
    {
      id: 'cozinha',
      titulo: 'Cozinha Solidária',
      categoria: { tipo: 'alimentacao', nome: 'Alimentação' },
      status: { tipo: 'aviso', nome: 'Precisa de voluntários' },
      imagem: 'projeto-cozinha',
      alt: 'Panela de sopa fumegante preparada na cozinha comunitária da ONG',
      legenda: 'Refeições servidas de segunda a sexta.',
      descricao: 'Preparo e distribuição de refeições nutritivas para famílias cadastradas.'
    },
    {
      id: 'capacita',
      titulo: 'Capacita Mães',
      categoria: { tipo: 'renda', nome: 'Geração de renda' },
      status: { tipo: 'sucesso', nome: 'Ativo' },
      imagem: 'projeto-capacita',
      alt: 'Duas participantes em oficina de capacitação profissional sobre uma bancada de trabalho',
      legenda: 'Oficinas de costura e empreendedorismo.',
      descricao: 'Cursos profissionalizantes para mães em busca de renda e autonomia.'
    }
  ],

  valores: [
    { titulo: 'Missão', texto: 'Promover a inclusão social e a dignidade de famílias em situação de vulnerabilidade.' },
    { titulo: 'Visão', texto: 'Ser referência regional em projetos sociais transparentes e sustentáveis.' },
    { titulo: 'Valores', lista: ['Transparência', 'Solidariedade', 'Respeito à diversidade'] }
  ],

  etapasVoluntariado: [
    'Preencha o formulário de cadastro.',
    'Participe de uma reunião de acolhimento.',
    'Escolha a área e os horários em que deseja atuar.'
  ],

  areasAtuacao: [
    { valor: 'educacao', nome: 'Educação' },
    { valor: 'cozinha', nome: 'Cozinha Solidária' },
    { valor: 'comunicacao', nome: 'Comunicação' }
  ],

  participacoes: { voluntario: 'Voluntário', doador: 'Doador', ambos: 'Voluntário e doador' },

  estados: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
            'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
};
