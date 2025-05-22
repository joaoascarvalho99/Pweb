const apiKey = '026d29804f15482e9e8546172f41bfb1';
const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=26&apiKey=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const newsContainer = document.getElementById('newsContainer');
    const highlight = document.getElementById('highlight');
    newsContainer.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
      const main = data.articles[0];
      highlight.innerHTML = `
        ${main.urlToImage ? `<img src="${main.urlToImage}" alt="Imagem da notícia">` : ''}
        <h3>${main.title}</h3>
        <p>${main.description || 'Sem descrição disponível.'}</p>
        <a href="${main.url}" target="_blank">Ler mais</a>
      `;

      data.articles.slice(1).forEach(article => {
        const newsItem = document.createElement('article');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Imagem da notícia">` : ''}
          <h3>${article.title}</h3>
          <p>${article.description || 'Sem descrição disponível.'}</p>
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
