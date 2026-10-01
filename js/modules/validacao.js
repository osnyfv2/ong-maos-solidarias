/* =========================================================
   Módulo: validacao
   Regras de validação com mensagens claras em português.
   Usa a validação nativa (validity) + regras próprias,
   como o cálculo dos dígitos verificadores do CPF.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.validacao = (function () {
  const mensagensFormato = {
    cpf: 'Digite o CPF no formato 000.000.000-00.',
    telefone: 'Digite o telefone com DDD, no formato (00) 00000-0000.',
    cep: 'Digite o CEP no formato 00000-000.',
    email: 'Digite um e-mail válido, como nome@exemplo.com.'
  };

  // Algoritmo oficial dos dígitos verificadores do CPF
  function cpfValido(cpf) {
    const n = cpf.replace(/\D/g, '');
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
      const digito = ((soma * 10) % 11) % 10;
      if (digito !== Number(n[t])) return false;
    }
    return true;
  }

  function idade(dataISO) {
    const nasc = new Date(dataISO + 'T00:00:00');
    const hoje = new Date();
    let anos = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
    return anos;
  }

  function rotulo(campo) {
    const label = campo.form && campo.form.querySelector('label[for="' + campo.id + '"]');
    return label ? label.textContent.replace('*', '').trim() : 'Este campo';
  }

  // Devolve '' se o campo estiver válido, ou a mensagem de erro
  function mensagem(campo) {
    campo.setCustomValidity('');
    const v = campo.validity;

    if (v.valueMissing) {
      if (campo.type === 'radio') return 'Escolha uma forma de participação.';
      if (campo.type === 'checkbox') return 'É preciso aceitar os termos para continuar.';
      if (campo.tagName === 'SELECT') return 'Selecione o estado.';
      return 'Preencha o campo ' + rotulo(campo) + '.';
    }
    if (v.typeMismatch || v.patternMismatch) return mensagensFormato[campo.id] || 'Formato inválido.';
    if (v.tooShort) return rotulo(campo) + ' precisa ter pelo menos ' + campo.minLength + ' caracteres.';
    if (v.rangeOverflow || v.rangeUnderflow) return 'Informe uma data de nascimento válida (idade mínima de 16 anos).';

    // Regras que o HTML não cobre sozinho
    if (campo.id === 'cpf' && !cpfValido(campo.value)) return 'CPF inválido. Confira os números digitados.';
    if (campo.id === 'nascimento' && campo.value && idade(campo.value) < 16) return 'É preciso ter pelo menos 16 anos para se cadastrar.';
    if (campo.id === 'nome' && campo.value.trim().split(/\s+/).length < 2) return 'Digite seu nome completo (nome e sobrenome).';
    return '';
  }

  return { mensagem: mensagem, cpfValido: cpfValido };
})();
