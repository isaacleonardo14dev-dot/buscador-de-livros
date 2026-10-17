// ==========================================
// 1. CONFIGURAÇÃO E CONEXÃO COM O SUPABASE
// ==========================================
const SUPABASE_URL = "https://qxbknzzbkqdqphaqzudi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NAWNQKEYxlQ1pif1RrW5Jg_44_yUwxv";

// Inicializa o cliente do Supabase usando 'supabaseClient' para evitar conflito com a CDN
const supabaseClient = (typeof window !== "undefined" && window.supabase) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Placeholder SVG local para capas indisponíveis
const SEM_CAPA = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="250"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" fill="#64748b" font-family="sans-serif" font-size="16" text-anchor="middle">Sem capa</text></svg>'
);

// ==========================================
// 2. INICIALIZAÇÃO DOS EVENTOS (DOM LOADED)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const campoBusca = document.getElementById('campo-busca');
  const btnBuscar = document.getElementById('btn-buscar');

  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      executarBusca();
    });
  }

  if (campoBusca) {
    campoBusca.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executarBusca();
      }
    });
  }

  // Carrega a lista inicial de favoritos do Supabase
  listarFavoritos();
});

// ==========================================
// 3. BUSCA NA OPEN LIBRARY API
// ==========================================
async function executarBusca() {
  const campoBusca = document.getElementById('campo-busca');
  const statusMsg = document.getElementById('status-msg');
  const resultadoArea = document.getElementById('resultado');

  const termo = campoBusca ? campoBusca.value.trim() : '';

  if (!termo) {
    if (statusMsg) statusMsg.textContent = 'Por favor, digite um termo para buscar.';
    return;
  }

  if (resultadoArea) resultadoArea.innerHTML = '';
  if (statusMsg) statusMsg.textContent = `🔍 Consultando acervo para "${termo}"...`;

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=12`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error('Servidor da API indisponível.');
    }

    const dados = await resposta.json();

    if (!dados.docs || dados.docs.length === 0) {
      if (statusMsg) statusMsg.textContent = `❌ Nenhum livro encontrado para "${termo}". Tente outro termo.`;
      return;
    }

    if (statusMsg) statusMsg.textContent = `Resultados encontrados para "${termo}":`;
    renderizarLivros(dados.docs);

  } catch (erro) {
    console.error('Erro na requisição:', erro);
    if (statusMsg) statusMsg.textContent = '❌ Erro ao conectar com a Open Library. Verifique sua conexão e tente novamente.';
  }
}

function renderizarLivros(livros) {
  const resultadoArea = document.getElementById('resultado');
  if (!resultadoArea) return;

  const fragmento = document.createDocumentFragment();

  livros.forEach(livro => {
    const card = document.createElement('div');
    card.className = 'card-livro';

    const capaUrl = livro.cover_i
      ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
      : SEM_CAPA;

    const tituloTexto = livro.title || 'Título desconhecido';
    const autorTexto = livro.author_name?.join(', ') ?? 'Autor não informado';
    const anoTexto = livro.first_publish_year ? `Publicado em ${livro.first_publish_year}` : 'Ano desconhecido';
    const linkLivro = livro.key ? `https://openlibrary.org${livro.key}` : '#';

    card.innerHTML = `
      <a href="${linkLivro}" target="_blank" rel="noopener noreferrer">
        <img src="${capaUrl}" alt="Capa de ${tituloTexto}" loading="lazy" onerror="this.onerror=null; this.src='${SEM_CAPA}';">
      </a>
      <div class="card-corpo">
        <h3 class="card-titulo"><a href="${linkLivro}" target="_blank" rel="noopener noreferrer">${tituloTexto}</a></h3>
        <p class="card-autor">Autor: ${autorTexto}</p>
        <p class="card-ano">${anoTexto}</p>
        <button class="btn-favoritar" style="margin-top: 8px; cursor: pointer; padding: 6px 12px; background-color: #f59e0b; color: white; border: none; border-radius: 4px;">⭐ Favoritar</button>
      </div>
    `;

    const btnFav = card.querySelector('.btn-favoritar');
    btnFav.addEventListener('click', (e) => {
      e.preventDefault();
      salvarFavorito(tituloTexto, autorTexto, capaUrl);
    });

    fragmento.appendChild(card);
  });

  resultadoArea.appendChild(fragmento);
}

// ==========================================
// 4. PERSISTÊNCIA DE DADOS COM SUPABASE (CRUD)
// ==========================================
async function salvarFavorito(titulo, autor, capaUrl) {
  if (!supabaseClient) {
    alert("Erro: Conexão com o Supabase não inicializada.");
    return;
  }

  const { error } = await supabaseClient
    .from('favoritos')
    .insert([{ titulo: titulo, autor: autor, capa_url: capaUrl }]);

  if (error) {
    console.error('Erro ao salvar favorito:', error);
    alert('Erro ao salvar no banco de dados.');
  } else {
    alert(`"${titulo}" foi adicionado aos seus favoritos!`);
    listarFavoritos();
  }
}

async function listarFavoritos() {
  const favoritosArea = document.getElementById('favoritos');
  if (!favoritosArea || !supabaseClient) return;

  const { data, error } = await supabaseClient
    .from('favoritos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar favoritos:', error);
    favoritosArea.innerHTML = '<p>Erro ao carregar favoritos salvos.</p>';
    return;
  }

  renderizarFavoritos(data);
}

function renderizarFavoritos(favoritos) {
  const favoritosArea = document.getElementById('favoritos');
  if (!favoritosArea) return;
  favoritosArea.innerHTML = '';

  if (favoritos.length === 0) {
    favoritosArea.innerHTML = '<p style="color: #64748b;">Nenhum livro favoritado ainda.</p>';
    return;
  }

  const fragmento = document.createDocumentFragment();

  favoritos.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card-livro';

    card.innerHTML = `
      <img src="${item.capa_url}" alt="Capa de ${item.titulo}" loading="lazy" onerror="this.onerror=null; this.src='${SEM_CAPA}';">
      <div class="card-corpo">
        <h3 class="card-titulo">${item.titulo}</h3>
        <p class="card-autor">Autor: ${item.autor}</p>
        <button class="btn-remover" style="margin-top: 8px; cursor: pointer; padding: 6px 12px; background-color: #ef4444; color: white; border: none; border-radius: 4px;">❌ Remover</button>
      </div>
    `;

    const btnRemover = card.querySelector('.btn-remover');
    btnRemover.addEventListener('click', () => removerFavorito(item.id));

    fragmento.appendChild(card);
  });

  favoritosArea.appendChild(fragmento);
}

async function removerFavorito(id) {
  if (!supabaseClient) return;

  const { error } = await supabaseClient
    .from('favoritos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao remover favorito:', error);
    alert('Erro ao remover livro dos favoritos.');
  } else {
    listarFavoritos();
  }
}