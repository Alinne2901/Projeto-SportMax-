// Função para converter preço de string 'R$20.00' para número 20.00
function precoToFloat(precoStr) {
  return parseFloat(precoStr.replace('R$', '').replace(',', '.'));
}

// Função para formatar número em preço 'R$20.00'
function formatarPreco(valor) {
  return 'R$' + valor.toFixed(2).replace('.', ',');
}

// Atualiza o total da barra fixa somando só os produtos selecionados
function atualizarTotal() {
  const produtos = document.querySelectorAll('.produto__carrinho');
  let total = 0;
  produtos.forEach(produto => {
    const checkbox = produto.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      const precoTotalElemento = produto.querySelector('.categoria h3:nth-child(3)');
      const precoTotal = precoToFloat(precoTotalElemento.textContent);
      total += precoTotal;
    }
  });
  const totalElemento = document.querySelector('.container__secundario h3');
  totalElemento.textContent = formatarPreco(total);
}

// Sincroniza o checkbox "Selecionar tudo" com os itens individuais
function sincronizarSelecionarTudo() {
  const produtos = document.querySelectorAll('.produto__carrinho');
  const selecionarTudoCheckbox = document.querySelector('.container__secundario input[type="checkbox"]');
  const todosSelecionados = Array.from(produtos).every(produto => produto.querySelector('input[type="checkbox"]').checked);
  selecionarTudoCheckbox.checked = todosSelecionados;
}

// Função que adiciona os eventos para cada produto
function adicionarEventosProduto(produto) {
  const checkbox = produto.querySelector('input[type="checkbox"]');
  const btnAumentar = produto.querySelector('.quantidade button:last-child');
  const btnDiminuir = produto.querySelector('.quantidade button:first-child');
  const contadorSpan = produto.querySelector('.quantidade span');
  const precoUnitarioElemento = produto.querySelector('.categoria h3:first-child');
  const precoTotalElemento = produto.querySelector('.categoria h3:nth-child(3)');
  const iconeExcluir = produto.querySelector('.icone i');

  // Atualiza o preço total baseado na quantidade
  function atualizarPrecoTotal(qtd) {
    const precoUnitario = precoToFloat(precoUnitarioElemento.textContent);
    const precoTotal = precoUnitario * qtd;
    precoTotalElemento.textContent = formatarPreco(precoTotal);
  }

  // Calcula preço total inicial
  atualizarPrecoTotal(parseInt(contadorSpan.textContent));

  btnAumentar.addEventListener('click', () => {
    let qtd = parseInt(contadorSpan.textContent);
    qtd++;
    contadorSpan.textContent = qtd;
    atualizarPrecoTotal(qtd);
    atualizarTotal();
  });

  btnDiminuir.addEventListener('click', () => {
    let qtd = parseInt(contadorSpan.textContent);
    if (qtd > 1) {
      qtd--;
      contadorSpan.textContent = qtd;
      atualizarPrecoTotal(qtd);
      atualizarTotal();
    }
  });

  checkbox.addEventListener('change', () => {
    sincronizarSelecionarTudo();
    atualizarTotal();
  });

  iconeExcluir.addEventListener('click', () => {
    produto.remove();
    atualizarTotal();
    sincronizarSelecionarTudo();
  });
}

// Configura evento no checkbox "Selecionar tudo"
function configurarSelecionarTudo() {
  const selecionarTudoCheckbox = document.querySelector('.container__secundario input[type="checkbox"]');
  selecionarTudoCheckbox.addEventListener('change', () => {
    const produtos = document.querySelectorAll('.produto__carrinho');
    produtos.forEach(produto => {
      const checkbox = produto.querySelector('input[type="checkbox"]');
      checkbox.checked = selecionarTudoCheckbox.checked;
    });
    atualizarTotal();
  });
}

// Configura evento para o botão "Excluir" na barra fixa
function configurarExcluirSelecionados() {
  const excluirSpan = document.querySelector('.barra__esquerda .texto__barra');
  excluirSpan.addEventListener('click', () => {
    const produtos = document.querySelectorAll('.produto__carrinho');
    produtos.forEach(produto => {
      const checkbox = produto.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        produto.remove();
      }
    });
    atualizarTotal();
    sincronizarSelecionarTudo();
  });
}

// Inicializa tudo ao carregar a página
function inicializarCarrinho() {
  const produtos = document.querySelectorAll('.produto__carrinho');
  produtos.forEach(produto => adicionarEventosProduto(produto));
  configurarSelecionarTudo();
  configurarExcluirSelecionados();
  atualizarTotal();
  sincronizarSelecionarTudo();
}

window.addEventListener('DOMContentLoaded', inicializarCarrinho);