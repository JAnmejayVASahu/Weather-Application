const newsApiKey = "YOUR_NEWS_API_KEY"; // Replace with your NewsAPI key
const newsUrl = `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApiKey}`;

async function fetchWeatherNews() {
    try {
        const response = await fetch(newsUrl);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        displayNewsArticles(data.articles);
    } catch (error) {
        console.error(error);
        document.querySelector(".news-container").innerHTML = "Failed to load news articles.";
    }
}

function displayNewsArticles(articles) {
    const newsContainer = document.querySelector(".news-container");
    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-article");

        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// Fetch news on page load
document.addEventListener("DOMContentLoaded", fetchWeatherNews);
