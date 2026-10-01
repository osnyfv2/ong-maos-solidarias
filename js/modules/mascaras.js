/* =========================================================
   Módulo: mascaras
   Formata CPF, telefone e CEP enquanto o usuário digita.
   Os campos indicam a máscara pelo atributo data-mascara.
   ========================================================= */
window.ONG = window.ONG || {};

ONG.mascaras = (function () {
  const formatos = {
    cpf: {
      digitos: 11,
      formatar: function (d) {
        return d.replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1-$2');
      }
    },
    telefone: {
      digitos: 11,
      formatar: function (d) {
        if (d.length <= 2) return d.length ? '(' + d : '';
        const ddd = '(' + d.slice(0, 2) + ') ';
        const resto = d.slice(2);
        const corte = resto.length > 8 ? 5 : 4;   // celular (9 dígitos) ou fixo (8)
        return resto.length > corte ? ddd + resto.slice(0, corte) + '-' + resto.slice(corte) : ddd + resto;
      }
    },
    cep: {
      digitos: 8,
      formatar: function (d) { return d.replace(/^(\d{5})(\d)/, '$1-$2'); }
    }
  };

  function formatar(tipo, valor) {
    const f = formatos[tipo];
    if (!f) return valor;
    return f.formatar(String(valor).replace(/\D/g, '').slice(0, f.digitos));
  }

  // Liga as máscaras a todos os campos [data-mascara] dentro do container
  function aplicar(container) {
    container.querySelectorAll('[data-mascara]').forEach(function (campo) {
      campo.addEventListener('input', function () {
        campo.value = formatar(campo.dataset.mascara, campo.value);
      });
    });
  }

  return { aplicar: aplicar, formatar: formatar };
})();
