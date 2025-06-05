const supabaseUrl = 'https://hejstpwldvkkunybbycb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlanN0cHdsZHZra3VueWJieWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjM5MjksImV4cCI6MjA2NDA5OTkyOX0.dE3_lTANaaPm8kF88YxOLXC-AUbT4pW-odvOJBKddl8';  // Coloca aqui a tua chave real

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  setupAuthUI();
  loadNews();
});

async function setupAuthUI() {
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');
  const userEmailSpan = document.getElementById('user-email');

  let user = null;

  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      if (error.message === 'Auth session missing!') {
        // Nenhum utilizador logado, está tudo ok, user fica null
        user = null;
      } else {
        console.error('Erro a obter utilizador:', error.message);
      }
    } else {
      user = data.user;
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }

  if (user) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    userEmailSpan.textContent = user.email;
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    userEmailSpan.textContent = '';
  }

  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert('Erro ao fazer logout: ' + error.message);
      return;
    }
    // Atualiza UI após logout
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    logoutLink.style.display = 'none';
    userEmailSpan.textContent = '';
  });
}

async function loadNews() {
  const apiKey = '026d29804f15482e9e8546172f41bfb1';
  const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${apiKey}`;

  const newsContainer = document.getElementById('newsContainer');
  const highlight = document.getElementById('highlight');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

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
  } catch (error) {
    highlight.innerText = 'Erro ao carregar notícias.';
    console.error('Erro no fetch das notícias:', error);
  }
}
