const apiKey = '026d29804f15482e9e8546172f41bfb1';
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.articles); // Array of news articles
    data.articles.forEach(article => {
      console.log(article.title);
    });
  })
  .catch(error => console.error('Error:', error));
