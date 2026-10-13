const campoBusca = document.getElementById('campo-busca');
const btnBuscar = document.getElementById('btn-buscar');
const statusMsg = document.getElementById('status-msg');
const resultadoArea = document.getElementById('resultado');

btnBuscar.addEventListener('click', executarBusca);
campoBusca.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') executarBusca();
});

function executarBusca() {
  const termo = campoBusca.value.trim();
  if (termo) {
    buscarLivros(termo);
  } else {
    statusMsg.textContent = 'Por favor, digite um termo para buscar.';
  }
}

async function buscarLivros(termo) {
  resultadoArea.innerHTML = '';
  statusMsg.textContent = `🔍 Consultando acervo para "${termo}"...`;

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=12`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error('Servidor da API indisponível.');
    }

    const dados = await resposta.json();

    if (!dados.docs || dados.docs.length === 0) {
      statusMsg.textContent = `❌ Nenhum livro encontrado para "${termo}". Tente outro termo.`;
      return;
    }

    statusMsg.textContent = `Resultados encontrados para "${termo}":`;
    renderizarLivros(dados.docs);

  } catch (erro) {
    console.error('Erro na requisição:', erro);
    statusMsg.textContent = '❌ Erro ao conectar com a Open Library. Verifique sua conexão e tente novamente.';
  }
}

function renderizarLivros(livros) {
  const fragmento = document.createDocumentFragment();

  livros.forEach(livro => {
    const card = document.createElement('a');
    card.className = 'card-livro';
    card.href = livro.key ? `https://openlibrary.org${livro.key}` : '#';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `Capa de ${livro.title}`;
    img.src = livro.cover_i
      ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
      : SEM_CAPA;
    img.onerror = () => { img.onerror = null; img.src = SEM_CAPA; };

    const corpo = document.createElement('div');
    corpo.className = 'card-corpo';

    const titulo = document.createElement('h3');
    titulo.className = 'card-titulo';
    titulo.textContent = livro.title;

    const autor = document.createElement('p');
    autor.className = 'card-autor';
    autor.textContent = `Autor: ${livro.author_name?.join(', ') ?? 'Autor não informado'}`;

    const ano = document.createElement('p');
    ano.className = 'card-ano';
    ano.textContent = livro.first_publish_year
      ? `Publicado em ${livro.first_publish_year}`
      : 'Ano desconhecido';

    corpo.append(titulo, autor, ano);
    card.append(img, corpo);
    fragmento.appendChild(card);
  });

  resultadoArea.appendChild(fragmento);
}

// Placeholder local, sem depender de serviço externo
const SEM_CAPA = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="250"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="16" text-anchor="middle">Sem capa</text></svg>'
);