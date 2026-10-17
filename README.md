# Buscador de Livros

## Autor
Isaac Leonardo — Matrícula 22607082

## Descrição
Uma aplicação web interativa para pesquisar livros em tempo real e consultar informações sobre obras e autores. É útil para leitores e estudantes que procuram detalhes de livros de forma rápida e intuitiva.
s
## API utilizada
- **Open Library API:** https://openlibrary.org/developers/api
- **Endpoints consumidos:**
  - `https://openlibrary.org/search.json?q={termo}` (para busca de livros)
  - `https://openlibrary.org/works/{id}.json` (para obter detalhes da obra ao clicar)

## Funcionalidades
- Pesquisar livros por título, autor ou palavra-chave
- Exibir capas, títulos, nomes de autores e ano de publicação
- Clique interativo para abrir os detalhes completos do livro
- Tratamento de erros e mensagens amigáveis para buscas sem resultado

## Como executar localmente
1. Clone: `git clone https://github.com/isaacleonardo14dev-dot/buscador-de-livros.git`
2. Abra o arquivo `index.html` no navegador

## Links
- **Aplicação no ar (GitHub Pages):** 
https://isaacleonardo14dev-dot.github.io/buscador-de-livros/
- **Repositório:** 
https://github.com/isaacleonardo14dev-dot/buscador-de-livros