const apiKey = '026d29804f15482e9e8546172f41bfb1';
const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const newsContainer = document.getElementById('newsContainer');
    const highlight = document.getElementById('highlight');
    newsContainer.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
      const validArticles = data.articles.filter(article =>
        article.title && article.description && article.urlToImage
      );

      if (validArticles.length === 0) {
        highlight.innerText = 'Nenhuma notícia válida disponível de momento.';
        return;
      }

      const main = validArticles[0];
      highlight.innerHTML = `
        <img src="${main.urlToImage}" alt="Imagem da notícia">
        <h3>${main.title}</h3>
        <p>${main.description}</p>
        <p class="fonte">Fonte: ${main.source.name}</p>
        <p class="data">Publicado em: ${new Date(main.publishedAt).toLocaleDateString('pt-PT')}</p>
        <a href="${main.url}" target="_blank">Ler mais</a>
      `;

      validArticles.slice(1, 26).forEach(article => {
        const newsItem = document.createElement('article');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          <img src="${article.urlToImage}" alt="Imagem da notícia">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <p class="fonte">Fonte: ${article.source.name}</p>
          <p class="data">Publicado em: ${new Date(article.publishedAt).toLocaleDateString('pt-PT')}</p>
          <a href="${article.url}" target="_blank">Ler mais</a>
        `;
        newsContainer.appendChild(newsItem);
      });

    } else {
      highlight.innerText = 'Nenhuma notícia disponível de momento.';
    }
  })
  .catch(error => {
    document.getElementById('highlight').innerText = 'Erro ao carregar notícias.';
    console.error('Erro:', error);
  });
